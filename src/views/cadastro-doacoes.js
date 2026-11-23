import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import { exibirCpf, somenteNumeros } from '../services/mascaras';

// Tira acentos e maiúsculas para a busca por nome
function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Quantos resultados da busca aparecem de uma vez
const MAX_RESULTADOS = 8;

function CadastroDoacoes() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/doacoes`;

  const [dtDoacao, setDtDoacao] = useState('');
  const [qtdDoada, setQtdDoada] = useState('');
  const [idDoador, setIdDoador] = useState('');
  const [busca, setBusca] = useState(''); // texto digitado na pesquisa de doador

  const [tipos, setTipos] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [doadores, setDoadores] = useState([]);

  const [dados, setDados] = useState(null);

  // Único hemocentro do sistema (Juiz de Fora)
  const hemocentro = hemocentros[0] ?? null;

  // Converte "01/01/2026" (db.json) -> "2026-01-01" (input type="date")
  function paraISO(dataBR) {
    if (!dataBR) return '';
    if (dataBR.includes('-')) return dataBR;
    const [dia, mes, ano] = dataBR.split('/');
    if (!dia || !mes || !ano) return '';
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  // Converte "2026-01-01" (input type="date") -> "01/01/2026" (db.json)
  function paraBR(dataISO) {
    if (!dataISO) return '';
    if (dataISO.includes('/')) return dataISO;
    const [ano, mes, dia] = dataISO.split('-');
    if (!ano || !mes || !dia) return '';
    return `${dia}/${mes}/${ano}`;
  }

  // descobre o tipo sanguineo do doador
  const doadorSelecionado = doadores.find((d) => String(d.id) === String(idDoador));
  const tipoDoador = doadorSelecionado
    ? tipos.find((t) => String(t.id) === String(doadorSelecionado.idTipoS))
    : null;

  // Pesquisa por nome ou CPF (o CPF pode ser digitado com ou sem pontos e traço)
  const termo = normalizar(busca);
  const digitos = somenteNumeros(busca);
  const encontrados =
    termo === ''
      ? []
      : doadores.filter(
        (d) =>
          normalizar(d.nome).includes(termo) ||
          (digitos !== '' && somenteNumeros(d.cpf).includes(digitos))
      );

  function selecionarDoador(doador) {
    setIdDoador(String(doador.id));
    setBusca('');
  }

  function limparDoador() {
    setIdDoador('');
    setBusca('');
  }

  function preencher(doacao) {
    setDtDoacao(paraISO(doacao.dtDoacao));
    setQtdDoada(doacao.qtdDoada ?? '');
    setIdDoador(doacao.idDoador != null ? String(doacao.idDoador) : '');
    setBusca('');
  }

  // Cancelar: descarta o que foi digitado e mantém o que era original
  function inicializar() {
    if (idParam == null) {
      preencher({}); // cadastro novo: limpa tudo
    } else if (dados) {
      preencher(dados); // edição: volta aos valores originais
    }
  }

  async function salvar() {
    if (!idDoador) {
      mensagemAlert('Pesquise e selecione o doador na lista.');
      return;
    }

    if (!dtDoacao || !qtdDoada || !idDoador) {
      mensagemAlert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!hemocentro) {
      mensagemErro('Hemocentro não encontrado. Tente novamente.');
      return;
    }

    const data = {
      dtDoacao: paraBR(dtDoacao),
      qtdDoada: Number(qtdDoada),
      idHemocentro: hemocentro.id,
      idDoador: Number(idDoador),
    };

    if (idParam == null) {
      await axios
        .post(baseURL, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso('Doação cadastrada com sucesso!');
          navigate(`/listagem-doacoes`);
        })
        .catch(function (error) {
          mensagemErro(
            typeof error.response?.data === 'string' && error.response.data
              ? error.response.data
              : 'Erro ao cadastrar a doação.'
          );
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, JSON.stringify({ ...dados, ...data }), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          mensagemSucesso('Doação atualizada com sucesso!');
          navigate(`/listagem-doacoes`);
        })
        .catch(function (error) {
          mensagemErro(
            typeof error.response?.data === 'string' && error.response.data
              ? error.response.data
              : 'Erro ao atualizar a doação.'
          );
        });
    }
  }

  async function buscar() {
    if (idParam == null) return;

    await axios.get(`${baseURL}/${idParam}`).then((response) => {
      setDados(response.data);
      preencher(response.data);
    });
  }

  useEffect(() => {
    axios.get(`${BASE_URL}/tipoS`).then((response) => {
      setTipos(response.data);
    });

    axios.get(`${BASE_URL}/hemocentros`).then((response) => {
      setHemocentros(response.data);
    });

    axios.get(`${BASE_URL}/doadores`).then((response) => {
      setDoadores(response.data);
    });
  }, []);

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  return (
    <div className='container tema-principal'>
      {/* Botão de voltar para a listagem de doações */}
      <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-doacoes')}>
        <ArrowBackIcon />
      </IconButton>
      <Card title='Cadastro de Doação'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Hemocentro:' htmlFor='inputHemocentro'>
                <input
                  type='text'
                  id='inputHemocentro'
                  value={hemocentro ? hemocentro.razaoSocial : ''}
                  className='form-control'
                  disabled
                />
              </FormGroup>
              <FormGroup label='Doador (nome ou CPF): *' htmlFor='inputDoador'>
                <div className='input-group'>
                  <input
                    type='text'
                    id='inputDoador'
                    value={doadorSelecionado ? doadorSelecionado.nome : busca}
                    placeholder='Digite o nome ou o CPF do doador'
                    autoComplete='off'
                    className='form-control'
                    name='busca'
                    onChange={(e) => {
                      setIdDoador('');
                      setBusca(e.target.value);
                    }}
                  />
                  {(idDoador || busca) && (
                    <button
                      type='button'
                      className='btn btn-outline-secondary'
                      onClick={limparDoador}
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {doadorSelecionado && (
                  <small className='text-muted'>
                    CPF: {exibirCpf(doadorSelecionado.cpf)}
                  </small>
                )}

                {!doadorSelecionado && termo !== '' && (
                  <div
                    className='list-group mt-1'
                    style={{ maxHeight: '260px', overflowY: 'auto' }}
                  >
                    {encontrados.length === 0 ? (
                      <div className='list-group-item text-muted'>
                        Nenhum doador encontrado.
                      </div>
                    ) : (
                      encontrados.slice(0, MAX_RESULTADOS).map((doador) => (
                        <button
                          key={doador.id}
                          type='button'
                          className='list-group-item list-group-item-action'
                          onClick={() => selecionarDoador(doador)}
                        >
                          {doador.nome} — CPF {exibirCpf(doador.cpf)}
                        </button>
                      ))
                    )}
                    {encontrados.length > MAX_RESULTADOS && (
                      <div className='list-group-item text-muted'>
                        Mostrando {MAX_RESULTADOS} de {encontrados.length}. Refine a pesquisa.
                      </div>
                    )}
                  </div>
                )}
              </FormGroup>
              <FormGroup label='Tipo Sanguíneo:' htmlFor='inputTipoS'>
                <input
                  type='text'
                  id='inputTipoS'
                  value={tipoDoador ? tipoDoador.tipo : ''}
                  placeholder='Preenchido automaticamente pelo doador'
                  className='form-control'
                  disabled
                />
              </FormGroup>
              <FormGroup label='Data da Doação: *' htmlFor='inputDtDoacao'>
                <input
                  type='date'
                  id='inputDtDoacao'
                  value={dtDoacao}
                  className='form-control'
                  name='dtDoacao'
                  onChange={(e) => setDtDoacao(e.target.value)}
                  onClick={(e) => e.target.showPicker?.()}
                />
              </FormGroup>
              <FormGroup label='Quantidade Doada (ml): *' htmlFor='inputQtdDoada'>
                <input
                  type='number'
                  min='0'
                  id='inputQtdDoada'
                  value={qtdDoada}
                  className='form-control'
                  name='qtdDoada'
                  onChange={(e) => setQtdDoada(e.target.value)}
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
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

export default CadastroDoacoes;