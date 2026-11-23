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
  limitarCep,
  limitarCnpj,
  limitarTelefone,
  mascararCep,
  mascararCnpj,
  mascararTelefone,
  somenteNumeros,
  telefoneCompleto,
} from '../services/mascaras';

function CadastroHemocentros() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/hemocentros`;

  const [razaoSocial, setRazaoSoial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarSenhaRepeticao, setMostrarSenhaRepeticao] = useState(false);
  const [senhaRepeticao, setSenhaRepeticao] = useState('');

  // Campos de endereço direto no objeto hemocentro
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  const [dados, setDados] = useState(null);
  const [usuario, setUsuario] = useState(null); // usuário (login) vinculado

  const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

  function preencher(hemocentro) {
    setRazaoSoial(hemocentro.razaoSocial ?? '');
    setCnpj(somenteNumeros(hemocentro.cnpj));
    setTelefone(somenteNumeros(hemocentro.telefone));
    setEmail(hemocentro.email ?? '');
    setSenha(hemocentro.senha ?? '');
    setSenhaRepeticao(hemocentro.senhaRepeticao ?? '');

    setCep(somenteNumeros(hemocentro.cep));
    setLogradouro(hemocentro.logradouro ?? '');
    setNumero(hemocentro.numero ?? '');
    setBairro(hemocentro.bairro ?? '');
    setCidade(hemocentro.cidade ?? '');
    setUf(hemocentro.uf ?? '');
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
      !razaoSocial ||
      !cnpj ||
      !email ||
      (idParam == null && !senha)
    ) {
      mensagemAlert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!cnpjCompleto(cnpj)) {
      mensagemAlert('CNPJ incompleto. Confira os números informados.');
      return;
    }

    if (telefone && !telefoneCompleto(telefone)) {
      mensagemAlert('Telefone incompleto. Confira os números informados.');
      return;
    }

    if (cep && !cepCompleto(cep)) {
      mensagemAlert('CEP incompleto. Confira os números informados.');
      return;
    }

    if (senha !== senhaRepeticao) return;

    if (idParam != null && !dados) return;

    // E-mail e senha ficam na tabela de usuários (é de lá que as listagens leem);
    // o hemocentro guarda apenas o idUsuario.
    const login = { email, senha, senhaRepeticao };

    const dadosHemocentro = {
      razaoSocial,
      cnpj,
      logradouro,
      numero,
      bairro,
      cidade,
      uf,
      cep,
      telefone,
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
          JSON.stringify({ ...login, perfil: 'hemocentro', status: true }),
          cabecalho
        );
        idUsuario = resposta.data.id;
      }

      // 2) cria ou atualiza o registro
      if (idParam == null) {
        await axios.post(
          baseURL,
          JSON.stringify({ ...dadosHemocentro, idUsuario }),
          cabecalho
        );
        mensagemSucesso(`Hemocentro ${razaoSocial} cadastrado com sucesso!`);
      } else {
        // Remove e-mail/senha que versões antigas gravavam dentro do registro
        const { email: emailAntigo, senha: senhaAntiga, senhaRepeticao: repeticaoAntiga, ...semLogin } = dados;

        await axios.put(
          `${baseURL}/${idParam}`,
          JSON.stringify({ ...semLogin, ...dadosHemocentro, idUsuario }),
          cabecalho
        );
        mensagemSucesso(`Hemocentro ${razaoSocial} atualizado com sucesso!`);
      }

      navigate(`/listagem-hemocentros`);
    } catch (error) {
      mensagemErro(
        typeof error.response?.data === 'string' && error.response.data
          ? error.response.data
          : 'Erro ao salvar o hemocentro.'
      );
    }
  }

  async function buscar() {
    if (idParam == null) return;

    const response = await axios.get(`${baseURL}/${idParam}`);
    const registro = response.data;

    // E-mail e senha vêm da tabela de usuários
    let usuarioAtual = null;
    if (registro.idUsuario) {
      const resposta = await axios.get(
        `${BASE_URL}/usuarios/${registro.idUsuario}`
      );
      usuarioAtual = resposta.data;
    }
    setUsuario(usuarioAtual);

    // Registros antigos, sem usuário vinculado, ainda podem ter o e-mail dentro do próprio registro
    const completo = {
      ...registro,
      email: usuarioAtual?.email ?? registro.email ?? '',
      senha: usuarioAtual?.senha ?? registro.senha ?? '',
      senhaRepeticao: usuarioAtual?.senhaRepeticao ?? registro.senhaRepeticao ?? '',
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
      {/* Botão de voltar para a listagem de hemocentros */}
      <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-hemocentros')}>
        <ArrowBackIcon />
      </IconButton>      <Card title='Cadastro de Hemocentro'>
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
                      onChange={(e) => setRazaoSoial(e.target.value)}
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

export default CadastroHemocentros;