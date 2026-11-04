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

  const [tipoS, setTipoS] = useState('');
  const [qtdDoada, setQtdDoada] = useState('');
  const [idHemocentro, setIdHemocentro] = useState('');
  const [idDoador, setIdDoador] = useState('');

  const [tipos, setTipos] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [doadores, setDoadores] = useState([]);

  const [dados, setDados] = useState(null);

  function preencher(doacao) {
    setTipoS(doacao.tipoS ?? '');
    setQtdDoada(doacao.qtdDoada ?? '');
    setIdHemocentro(doacao.idHemocentro ?? '');
    setIdDoador(doacao.idDoador ?? '');
  }

  function inicializar() {
    if (idParam == null) {
      preencher({});
    } else if (dados) {
      preencher(dados);
    }
  }

  async function salvar() {
    if (!tipoS || !qtdDoada || !idHemocentro || !idDoador) {
      mensagemAlert('Preencha todos os campos obrigatórios.');
      return;
    }

    const data = { tipoS, qtdDoada, idHemocentro, idDoador };

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
    <div className='container'>
      <Card title='Cadastro de Doação'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Tipo Sanguíneo: *' htmlFor='inputTipoS'>
                <select
                  id='inputTipoS'
                  value={tipoS}
                  className='form-control'
                  name='tipoS'
                  onChange={(e) => setTipoS(e.target.value)}
                >
                  <option value=''>Selecione</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.tipo}>
                      {tipo.tipo}
                    </option>
                  ))}
                </select>
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
              <FormGroup label='Hemocentro: *' htmlFor='inputHemocentro'>
                <select
                  id='inputHemocentro'
                  value={idHemocentro}
                  className='form-control'
                  name='idHemocentro'
                  onChange={(e) =>
                    setIdHemocentro(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                >
                  <option value=''>Selecione</option>
                  {hemocentros.map((hemocentro) => (
                    <option key={hemocentro.id} value={hemocentro.id}>
                      {hemocentro.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label='Doador: *' htmlFor='inputDoador'>
                <select
                  id='inputDoador'
                  value={idDoador}
                  className='form-control'
                  name='idDoador'
                  onChange={(e) =>
                    setIdDoador(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                >
                  <option value=''>Selecione</option>
                  {doadores.map((doador) => (
                    <option key={doador.id} value={doador.id}>
                      {doador.nome}
                    </option>
                  ))}
                </select>
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