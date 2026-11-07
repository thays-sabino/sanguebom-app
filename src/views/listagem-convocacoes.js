import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Card from '../components/card';

import '../custom.css';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/convocacoes`;

function ListagemConvocacoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-convocacoes`);
  };

  const editar = (id) => {
    navigate(`/cadastro-convocacoes/${id}`);
  };

  const [convocacoes, setConvocacoes] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setConvocacoes(response.data);
    });

    axios.get(`${BASE_URL}/hemocentros`).then((response) => {
      setHemocentros(response.data);
    });
  }, []);

  function nomeHemocentro(idHemocentro) {
    const hemocentro = hemocentros.find((h) => h.id === idHemocentro);
    return hemocentro ? hemocentro.nome : '';
  }

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setConvocacoes(
          convocacoes.filter((convocacao) => convocacao.id !== id)
        );
        mensagemSucesso('Convocação excluída com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir a convocação.');
      });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Convocações'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-danger'
                onClick={cadastrar}
              >
                Novo Cadastro
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>Hemocentro</th>
                    <th scope='col'>Urgência</th>
                     <th scope='col'>Tipo Sanguíneo</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {convocacoes.map((convocacao) => (
                    <tr key={convocacao.id}>
                      <td>{convocacao.id}</td>
                      <td>{nomeHemocentro(convocacao.idHemocentro)}</td>
                      <td>{convocacao.urgencia}</td>

                      <td>{convocacao.tipoS}</td>
                      
                      <td>{convocacao.status}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(convocacao.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(convocacao.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemConvocacoes;
