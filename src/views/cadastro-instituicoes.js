import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import {
  cepCompleto,
  cnpjCompleto,
  cpfCompleto,
  limitarCep,
  limitarCnpj,
  limitarCpf,
  limitarTelefone,
  mascararCep,
  mascararCnpj,
  mascararCpf,
  mascararTelefone,
  somenteNumeros,
  telefoneCompleto,
} from '../services/mascaras';

function CadastroInstituicoes() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/instituicoes`;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaRepeticao, setMostrarSenhaRepeticao] = useState(false);
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
  const [usuario, setUsuario] = useState(null); // usuário (login) vinculado à instituição

  const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

  function preencher(instituicao) {
    setEmail(instituicao.email ?? '');
    setSenha(instituicao.senha ?? '');
    setSenhaRepeticao(instituicao.senhaRepeticao ?? '');
    setRazaoSocial(instituicao.razaoSocial ?? '');
    setCnpj(somenteNumeros(instituicao.cnpj));
    setResponsavelTec(instituicao.responsavelTec ?? '');
    setCpfRT(somenteNumeros(instituicao.cpfRT));
    setTelefone(somenteNumeros(instituicao.telefone));

    setCep(somenteNumeros(instituicao.cep));
    setLogradouro(instituicao.logradouro ?? '');
    setNumero(instituicao.numero ?? '');
    setBairro(instituicao.bairro ?? '');
    setCidade(instituicao.cidade ?? '');
    setUf(instituicao.uf ?? '');
  }

  function inicializar() {
    if (idParam == null) {
      preencher({});      // cadastro novo: limpa tudo
    } else if (dados) {
      preencher(dados);   // edição: volta aos valores originais
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

    if (!cnpjCompleto(cnpj)) {
      mensagemAlert('CNPJ incompleto. Confira os números informados.');
      return;
    }

    if (!cpfCompleto(cpfRT)) {
      mensagemAlert('CPF do responsável técnico incompleto. Confira os números informados.');
      return;
    }

    if (!telefoneCompleto(telefone)) {
      mensagemAlert('Telefone incompleto. Confira os números informados.');
      return;
    }

    if (cep && !cepCompleto(cep)) {
      mensagemAlert('CEP incompleto. Confira os números informados.');
      return;
    }

    if (senha !== senhaRepeticao) return;

    if (idParam != null && !dados) return;

    // E-mail e senha ficam na tabela de usuários (é de lá que a listagem lê);
    // a instituição guarda apenas o idUsuario.
    const login = { email, senha, senhaRepeticao };

    const dadosInstituicao = {
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

    const cabecalho = { headers: { 'Content-Type': 'application/json' } };

    try {
      // 1) cria ou atualiza o usuário
      let idUsuario = usuario?.id;

      if (idUsuario != null) {
        await axios.put(
          `${BASE_URL}/usuarios/${idUsuario}`,
          JSON.stringify({ ...usuario, ...login }),
          cabecalho
        );
      } else {
        const resposta = await axios.post(
          `${BASE_URL}/usuarios`,
          JSON.stringify({ ...login, perfil: 'instituicao', status: true }),
          cabecalho
        );
        idUsuario = resposta.data.id;
      }

      // 2) cria ou atualiza a instituição
      if (idParam == null) {
        await axios.post(
          baseURL,
          JSON.stringify({ ...dadosInstituicao, idUsuario }),
          cabecalho
        );
        mensagemSucesso(`Instituição ${razaoSocial} cadastrada com sucesso!`);
      } else {
        // Remove e-mail/senha que versões antigas gravavam dentro da instituição
        const { email: emailAntigo, senha: senhaAntiga, senhaRepeticao: repeticaoAntiga, ...instituicaoSemLogin } = dados;

        await axios.put(
          `${baseURL}/${idParam}`,
          JSON.stringify({ ...instituicaoSemLogin, ...dadosInstituicao, idUsuario }),
          cabecalho
        );
        mensagemSucesso(`Instituição ${razaoSocial} atualizada com sucesso!`);
      }

      navigate(`/listagem-instituicoes`);
    } catch (error) {
      mensagemErro(
        typeof error.response?.data === 'string' && error.response.data
          ? error.response.data
          : 'Erro ao salvar a instituição.'
      );
    }
  }

  async function buscar() {
    if (idParam == null) return;

    const response = await axios.get(`${baseURL}/${idParam}`);
    const instituicao = response.data;

    // E-mail e senha vêm da tabela de usuários
    let usuarioAtual = null;
    if (instituicao.idUsuario) {
      const resposta = await axios.get(
        `${BASE_URL}/usuarios/${instituicao.idUsuario}`
      );
      usuarioAtual = resposta.data;
    }
    setUsuario(usuarioAtual);

    // Instituições antigas, sem usuário vinculado, ainda podem ter o e-mail dentro do próprio registro
    const completo = {
      ...instituicao,
      email: usuarioAtual?.email ?? instituicao.email ?? '',
      senha: usuarioAtual?.senha ?? instituicao.senha ?? '',
      senhaRepeticao: usuarioAtual?.senhaRepeticao ?? instituicao.senhaRepeticao ?? '',
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
      {/* Botão de voltar para a listagem de instituições */}
      <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-instituicoes')}>
        <ArrowBackIcon />
      </IconButton>
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
                      value={mascararCnpj(cnpj)}
                      placeholder='00.000.000/0000-00'
                      className='form-control'
                      name='cnpj'
                      onChange={(e) => setCnpj(limitarCnpj(e.target.value))}
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
                      value={mascararTelefone(telefone)}
                      placeholder='(00) 0000-0000'
                      className='form-control'
                      name='telefone'
                      onChange={(e) => setTelefone(limitarTelefone(e.target.value))}
                    />
                  </FormGroup>
                </div>
              </div>

              <hr className='my-4' />
              <h5 className='secao-titulo'>Responsável Técnico</h5>
              <div className='row'>
                <div className='col-md-6'>
                  <FormGroup
                    label='Nome: *'
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
                      value={mascararCpf(cpfRT)}
                      placeholder='000.000.000-00'
                      className='form-control'
                      name='cpfRT'
                      onChange={(e) => setCpfRT(limitarCpf(e.target.value))}
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
                      value={mascararCep(cep)}
                      placeholder='00000-000'
                      className='form-control'
                      name='cep'
                      onChange={(e) => setCep(limitarCep(e.target.value))}
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
                    <div className='input-group'>
                      <input
                        type={mostrarSenha ? 'text' : 'password'}
                        id='inputSenha'
                        value={senha}
                        className='form-control'
                        name='senha'
                        onChange={(e) => setSenha(e.target.value)}
                      />
                      <button
                        type='button'
                        className='btn btn-outline-secondary'
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                      >
                        {mostrarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    </div>
                  </FormGroup>
                </div>
                <div className='col-md-6'>
                  <FormGroup
                    label='Repita a Senha: *'
                    htmlFor='inputSenhaRepeticao'
                  >
                    <div className='input-group'>
                      <input
                        type={mostrarSenhaRepeticao ? 'text' : 'password'}
                        id='inputSenhaRepeticao'
                        value={senhaRepeticao}
                        className='form-control'
                        name='senhaRepeticao'
                        onChange={(e) => setSenhaRepeticao(e.target.value)}
                      />
                      <button
                        type='button'
                        className='btn btn-outline-secondary'
                        onClick={() => setMostrarSenhaRepeticao(!mostrarSenhaRepeticao)}
                      >
                        {mostrarSenhaRepeticao ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    </div>
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