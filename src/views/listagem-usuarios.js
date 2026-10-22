import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Card from '../components/card';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/usuarios`;

function ListagemUsuarios() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-usuarios`);
  };

  const editar = (id) => {
    navigate(`/cadastro-usuarios/${id}`);
  };

  const [usuarios, setUsuarios] = useState([]);

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`).then(() => {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    });
  }

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setUsuarios(response.data);
    });
  }, []);

  return (
    <div className='container'>
      <Card title='Listagem de Usuários'>
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
                    <th scope='col'>E-mail</th>
                    <th scope='col'>Senha</th>
                    <th scope='col'>Perfil</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.senha}</td>
                      <td>{usuario.perfil}</td>
                      <td>{usuario.status ? 'Ativo' : 'Inativo'}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(usuario.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(usuario.id)}
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

export default ListagemUsuarios;
