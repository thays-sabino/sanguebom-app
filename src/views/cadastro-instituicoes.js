import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroInstituicoes() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/instituicoes`;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepeticao, setSenhaRepeticao] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavelTec, setResponsavelTec] = useState('');
  const [cpfRT, setCpfRT] = useState('');
  const [telefone, setTelefone] = useState('');

  const [dados, setDados] = useState(null);

  const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

  function preencher(instituicao) {
    setNome(instituicao.nome ?? '');
    setEmail(instituicao.email ?? '');
    setSenha(instituicao.senha ?? '');
    setSenhaRepeticao(instituicao.senhaRepeticao ?? '');
    setRazaoSocial(instituicao.razaoSocial ?? '');
    setCnpj(instituicao.cnpj ?? '');
    setResponsavelTec(instituicao.responsavelTec ?? '');
    setCpfRT(instituicao.cpfRT ?? '');
    setTelefone(instituicao.telefone ?? '');
  }

  function inicializar() {
    const estaVazio = !nome && !email && !senha &&!senhaRepeticao && !razaoSocial && !cnpj && !responsavelTec && !cpfRT && !telefone; // Verifica se os campos estão vazios

        if(estaVazio){ // Se esta vazio volta para a pagina anterior
            navigate(-1);
            return;
        }
    
    if (idParam == null) {
      preencher({});
    } else if (dados) {
      preencher(dados);
    }
  }

  async function salvar() {
    if (
      !nome ||
      !email ||
      !razaoSocial ||
      !cnpj ||
      !responsavelTec ||
      !cpfRT ||
      !telefone ||
      (idParam == null && !senha)
    ) {
      mensagemAlert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== senhaRepeticao) return;

    if (idParam == null) {
      const data = {
        nome,
        email,
        senha,
        senhaRepeticao,
        razaoSocial,
        cnpj,
        responsavelTec,
        cpfRT,
        telefone,
      };

      await axios
        .post(baseURL, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso(`Instituição ${nome} cadastrada com sucesso!`);
          navigate(`/listagem-instituicoes`);
        })
        .catch(function (error) {
          mensagemErro(
            typeof error.response?.data === 'string' && error.response.data
              ? error.response.data
              : 'Erro ao cadastrar a instituição.'
          );
        });
    } else {
      const data = {
        ...dados,
        nome,
        email,
        senha,
        senhaRepeticao,
        razaoSocial,
        cnpj,
        responsavelTec,
        cpfRT,
        telefone,
      };

      await axios
        .put(`${baseURL}/${idParam}`, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso(`Instituição ${nome} atualizada com sucesso!`);
          navigate(`/listagem-instituicoes`);
        })
        .catch(function (error) {
          mensagemErro(
            typeof error.response?.data === 'string' && error.response.data
              ? error.response.data
              : 'Erro ao atualizar a instituição.'
          );
        });
    }
  }

  async function buscar() {
    if (idParam == null) return;

    const response = await axios.get(`${baseURL}/${idParam}`);
    const instituicao = response.data;

    let senhaAtual = instituicao.senha ?? '';
    let repeticaoAtual = instituicao.senhaRepeticao ?? '';

    if (!senhaAtual && instituicao.idUsuario) {
      const usuario = await axios.get(
        `${BASE_URL}/usuarios/${instituicao.idUsuario}`
      );
      senhaAtual = usuario.data.senha ?? '';
      repeticaoAtual = usuario.data.senhaRepeticao ?? '';
    }

    const completo = {
      ...instituicao,
      senha: senhaAtual,
      senhaRepeticao: repeticaoAtual,
    };

    setDados(completo);
    preencher(completo);
  }

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  return (
    <div className='container'>
      <Card title='Cadastro de Instituição'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='E-mail: *' htmlFor='inputEmail'>
                <input
                  type='email'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Senha: *' htmlFor='inputSenha'>
                <input
                  type='password'
                  id='inputSenha'
                  value={senha}
                  className='form-control'
                  name='senha'
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormGroup>
              <FormGroup
                label='Repita a Senha: *'
                htmlFor='inputSenhaRepeticao'
              >
                <input
                  type='password'
                  id='inputSenhaRepeticao'
                  value={senhaRepeticao}
                  className='form-control'
                  name='senhaRepeticao'
                  onChange={(e) => setSenhaRepeticao(e.target.value)}
                />
                {senhasDiferentes && (
                  <small className='text-danger'>
                    As senhas não conferem.
                  </small>
                )}
              </FormGroup>
              <FormGroup label='Razão Social: *' htmlFor='inputRazaoSocial'>
                <input
                  type='text'
                  id='inputRazaoSocial'
                  value={razaoSocial}
                  className='form-control'
                  name='razaoSocial'
                  onChange={(e) => setRazaoSocial(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CNPJ: *' htmlFor='inputCnpj'>
                <input
                  type='text'
                  id='inputCnpj'
                  value={cnpj}
                  className='form-control'
                  name='cnpj'
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </FormGroup>
              <FormGroup
                label='Responsável Técnico: *'
                htmlFor='inputResponsavelTec'
              >
                <input
                  type='text'
                  id='inputResponsavelTec'
                  value={responsavelTec}
                  className='form-control'
                  name='responsavelTec'
                  onChange={(e) => setResponsavelTec(e.target.value)}
                />
              </FormGroup>
              <FormGroup
                label='CPF do Responsável Técnico: *'
                htmlFor='inputCpfRT'
              >
                <input
                  type='text'
                  id='inputCpfRT'
                  value={cpfRT}
                  className='form-control'
                  name='cpfRT'
                  onChange={(e) => setCpfRT(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='text'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefone'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                  disabled={senhasDiferentes}
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroInstituicoes;
