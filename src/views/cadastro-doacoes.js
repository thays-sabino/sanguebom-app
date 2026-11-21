import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroDoacoes() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/doacoes`;

  const [dtDoacao, setDtDoacao] = useState('');
  const [qtdDoada, setQtdDoada] = useState('');
  const [idHemocentro, setIdHemocentro] = useState('');
  const [idDoador, setIdDoador] = useState('');

  const [tipos, setTipos] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [doadores, setDoadores] = useState([]);

  const [dados, setDados] = useState(null);

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
  const tipoDoador = doadorSelecionado ? tipos.find((t) => String(t.id) === String(doadorSelecionado.idTipoS)): null;

  function preencher(doacao) {
    setDtDoacao(doacao.dtDoacao ?? '');
    setQtdDoada(doacao.qtdDoada ?? '');
    setIdHemocentro(doacao.idHemocentro != null ? String(doacao.idHemocentro) : '');
    setIdDoador(doacao.idDoador != null ? String(doacao.idDoador) : '');
  }

  function inicializar() {
    // Volta para a página anterior na edição
        if (idParam != null){
            navigate(-1);
            return;
        }
    
    const estaVazio = !dtDoacao && !qtdDoada && !idHemocentro &&!idDoador; // Verifica se os campos estão vazios

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
    if (!dtDoacao || !qtdDoada || !idHemocentro || !idDoador) {
      mensagemAlert('Preencha todos os campos obrigatórios.');
      return;
    }

    const data = { dtDoacao: paraBR(dtDoacao), qtdDoada, idHemocentro: Number(idHemocentro), idDoador: Number(idDoador), };

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
      <Card title='Cadastro de Doação'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Hemocentro: *' htmlFor='inputHemocentro'>
                <select
                  id='inputHemocentro'
                  value={String(idHemocentro)}
                  className='form-control'
                  name='idHemocentro'
                  onChange={(e) =>
                    setIdHemocentro(e.target.value)}
                >
                  <option value=''>Selecione</option>
                  {hemocentros.map((hemocentro) => (
                    <option key={hemocentro.id} value={hemocentro.id}>
                      {hemocentro.razaoSocial}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label='Doador: *' htmlFor='inputDoador'>
                <select
                  id='inputDoador'
                  value={String(idDoador)}
                  className='form-control'
                  name='idDoador'
                  onChange={(e) => setIdDoador(e.target.value)}
                >
                  <option value=''>Selecione</option>
                  {doadores.map((doador) => (
                    <option key={doador.id} value={String(doador.id)}>
                      {doador.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label='Tipo Sanguíneo: *' htmlFor='inputTipoS'>
                <input
                  type='text'
                  id='inputTipoS'
                  value={tipoDoador ? tipoDoador.tipo : ''}
                  placeholder='Preenchido automaticamente pelo doador'
                  className='form-control'
                  disabled
                />
              </FormGroup>
              <FormGroup label='Data da Doação: *' htmlFor='inptDtDoacao'>
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
