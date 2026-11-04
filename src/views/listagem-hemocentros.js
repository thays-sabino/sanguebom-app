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

const baseURL = `${BASE_URL}/hemocentros`;

function ListagemHemocentros() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-hemocentro`);
  };

  const editar = (id) => {
    navigate(`/cadastro-hemocentro/${id}`);
  };

  const [hemocentros, setHemocentros] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setHemocentros(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setHemocentros(hemocentros.filter((hemocentro) => hemocentro.id !== id));
        mensagemSucesso('Hemocentro excluído com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir o hemocentro.');
      });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Hemocentros'>
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
                    <th scope='col'>Nome</th>
                    <th scope='col'>E-mail</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {hemocentros.map((hemocentro) => (
                    <tr key={hemocentro.id}>
                      <td>{hemocentro.id}</td>
                      <td>{hemocentro.nome}</td>
                      <td>{hemocentro.email}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(hemocentro.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(hemocentro.id)}
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

export default ListagemHemocentros;