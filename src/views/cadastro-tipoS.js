import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroTipoS() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const baseURL = `${BASE_URL}/tipoS`;

  const [id, setId] = useState('');
  const [tipo, setTipo] = useState('');

  const [dados, setDados] = useState(null);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setTipo('');
    } else if (dados) {
      setId(dados.id);
      setTipo(dados.tipo);
    }
  }

  async function salvar() {
    if (idParam == null) {
      await axios
        .post(baseURL, JSON.stringify({ tipo }), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          navigate(`/listagem-tipoS`);
        })
        .catch(function (error) {
          console.error(error);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, JSON.stringify({ id, tipo }), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function () {
          navigate(`/listagem-tipoS`);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  async function buscar() {
    if (idParam == null) return;

    await axios.get(`${baseURL}/${idParam}`).then((response) => {
      setDados(response.data);
      setId(response.data.id);
      setTipo(response.data.tipo);
    });
  }

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  return (
    <div className='container'>
      <Card title='Cadastro de Tipo Sanguíneo'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Tipo: *' htmlFor='inputTipo'>
                <input
                  type='text'
                  id='inputTipo'
                  value={tipo}
                  className='form-control'
                  name='tipo'
                  onChange={(e) => setTipo(e.target.value)}
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

export default CadastroTipoS;
