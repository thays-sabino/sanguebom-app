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

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepeticao, setSenhaRepeticao] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavelTec, setResponsavelTec] = useState('');
  const [cpfRT, setCpfRT] = useState('');
  const [telefone, setTelefone] = useState('');

  // Campos de endereço direto no objeto hemocentro
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [cep, setCep] = useState('');

  const [dados, setDados] = useState(null);

  const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

  function preencher(instituicao) {
    setEmail(instituicao.email ?? '');
    setSenha(instituicao.senha ?? '');
    setSenhaRepeticao(instituicao.senhaRepeticao ?? '');
    setRazaoSocial(instituicao.razaoSocial ?? '');
    setCnpj(instituicao.cnpj ?? '');
    setResponsavelTec(instituicao.responsavelTec ?? '');
    setCpfRT(instituicao.cpfRT ?? '');
    setTelefone(instituicao.telefone ?? '');

    setCep(instituicao.cep ?? '');
    setLogradouro(instituicao.logradouro ?? '');
    setNumero(instituicao.numero ?? '');
    setBairro(instituicao.bairro ?? '');
    setCidade(instituicao.cidade ?? '');
    setUf(instituicao.uf ?? '');
  }

  function inicializar() {
    // Volta para a página anterior na edição
        if (idParam != null){
            navigate(-1);
            return;
        }
    
    const estaVazio = !email && !senha &&!senhaRepeticao && !razaoSocial && !cnpj && !responsavelTec && !cpfRT && !telefone && !cep && !logradouro && !numero && !bairro && !cidade && !uf; // Verifica se os campos estão vazios

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
        email,
        senha,
        senhaRepeticao,
        razaoSocial,
        cnpj,
        responsavelTec,
        cpfRT,
        telefone,
        logradouro, 
        numero, 
        bairro, 
        cidade, 
        uf, 
        cep,
      };

      await axios
        .post(baseURL, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso(`Instituição ${razaoSocial} cadastrada com sucesso!`);
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
        email,
        senha,
        senhaRepeticao,
        razaoSocial,
        cnpj,
        responsavelTec,
        cpfRT,
        telefone,
        logradouro, 
        numero, 
        bairro, 
        cidade, 
        uf, 
        cep,
      };

      await axios
        .put(`${baseURL}/${idParam}`, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso(`Instituição ${razaoSocial} atualizada com sucesso!`);
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

    let emailAtual = instituicao.email ?? '';
    let senhaAtual = instituicao.senha ?? '';
    let repeticaoAtual = instituicao.senhaRepeticao ?? '';

    if ((!emailAtual || !senhaAtual) && instituicao.idUsuario) {
      const usuario = await axios.get(
        `${BASE_URL}/usuarios/${instituicao.idUsuario}`
      );
      emailAtual = emailAtual || (usuario.data.email ?? '');
      senhaAtual = usuario.data.senha ?? '';
      repeticaoAtual = usuario.data.senhaRepeticao ?? '';
    }

    const completo = {
      ...instituicao,
      email: emailAtual,
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
    <div className='container tema-principal'>
      <Card title='Cadastro de Instituição'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>

              <div className='row'>
                <div className='col-md-6'>
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
                </div>
                <div className='col-md-6'>
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
                </div>
              </div>

              <div className='row'>
                <div className='col-md-6'>
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
                </div>
                <div className='col-md-6'>
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
                </div>
              </div>

              <hr className='my-4' />
              <h5 className='secao-titulo'>Responsável Técnico</h5>
              <div className='row'>
                <div className='col-md-6'>
                  <FormGroup 
                    label='Login: *' 
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
                </div>
                <div className='col-md-6'>
                  <FormGroup
                    label='CPF: *'
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
                </div>
              </div>

              <hr className='my-4' />
              <h5 className='secao-titulo'>Endereço</h5>

              <div className='row'>
                <div className='col-md-3'>
                  <FormGroup label='CEP: *' htmlFor='inputCep'>
                    <input
                      type='text'
                      id='inputCep'
                      value={cep}
                      className='form-control'
                      name='cep'
                      onChange={(e) => setCep(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-7'>
                  <FormGroup label='Logradouro: *' htmlFor='inputLogradouro'>
                    <input
                      type='text'
                      id='inputLogradouro'
                      value={logradouro}
                      className='form-control'
                      name='logradouro'
                      onChange={(e) => setLogradouro(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-2'>
                  <FormGroup label='Número: *' htmlFor='inputNumero'>
                    <input
                      type='text'
                      id='inputNumero'
                      value={numero}
                      className='form-control'
                      name='numero'
                      onChange={(e) => setNumero(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className='row'>
                <div className='col-md-5'>
                  <FormGroup label='Bairro: *' htmlFor='inputBairro'>
                    <input
                      type='text'
                      id='inputBairro'
                      value={bairro}
                      className='form-control'
                      name='bairro'
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-5'>
                  <FormGroup label='Cidade: *' htmlFor='inputCidade'>
                    <input
                      type='text'
                      id='inputCidade'
                      value={cidade}
                      className='form-control'
                      name='cidade'
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className='col-md-2'>
                  <FormGroup label='UF: *' htmlFor='inputUf'>
                    <input
                      type='text'
                      id='inputUf'
                      value={uf}
                      maxLength={2}
                      className='form-control'
                      name='uf'
                      onChange={(e) => setUf(e.target.value.toUpperCase())}
                    />
                  </FormGroup>
                </div>
              </div>
              
              <hr className='my-4' />
              <div className='row'>
                <div className='col-md-6'>
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
                </div>
                <div className='col-md-6'>
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
                </div>
              </div>
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
