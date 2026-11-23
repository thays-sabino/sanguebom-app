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

const baseURL = `${BASE_URL}/adms`;
const usuariosURL = `${BASE_URL}/usuarios`;

function ListagemAdms() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-adms`);
  };

  const editar = (id) => {
    navigate(`/cadastro-adms/${id}`);
  };

  const [adms, setAdms] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setAdms(response.data);
    });

    axios.get(usuariosURL).then((response) => {
      setUsuarios(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setAdms(adms.filter((adm) => adm.id !== id));
        mensagemSucesso('Administrador excluído com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir o administrador.');
      });
  }

  return (
    <div className='container tema-secundario'>
      <Card title='Listagem de Administradores'>
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
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Login</th>
                      <th scope='col'>E-mail</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adms.map((adm) => {
                      const usuarioEncontrado = usuarios.find(
                        (u) => String(u.id) === String(adm.idUsuario)
                      );

                      return (
                        <tr key={adm.id}>
                          <td>{adm.login}</td>
                          <td>{usuarioEncontrado ? usuarioEncontrado.email : 'E-mail não encontrado'}</td>
                          <td>
                            <Stack spacing={1} padding={0} direction='row'>
                              <IconButton
                                aria-label='edit'
                                onClick={() => editar(adm.id)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label='delete'
                                onClick={() => excluir(adm.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemAdms;