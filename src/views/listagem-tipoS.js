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

const baseURL = `${BASE_URL}/tipoS`;

function ListagemTipoS() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-tipoS`);
  };

  const editar = (id) => {
    navigate(`/cadastro-tipoS/${id}`);
  };

  const [tipoS, setTipoS] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setTipoS(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`).then(() => {
      setTipoS(tipoS.filter((tipo) => tipo.id !== id));
      mensagemSucesso('Tipo sanguíneo excluído com sucesso!');
    })
      .catch(() => {
        mensagemErro('Erro ao excluir o tipo sanguíneo.');
      });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Tipos Sanguíneos'>
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
                    <th scope='col'>Tipo</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoS.map((tipo) => (
                    <tr key={tipo.id}>
                      <td>{tipo.id}</td>
                      <td>{tipo.tipo}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(tipo.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(tipo.id)}
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

export default ListagemTipoS;