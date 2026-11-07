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

const baseURL = `${BASE_URL}/doadores`;

function ListagemDoadores() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-doadores`);
  };

  const editar = (id) => {
    navigate(`/cadastro-doadores/${id}`);
  };

  const [doadores, setDoadores] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDoadores(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`).then(() => {
      setDoadores(doadores.filter((doador) => doador.id !== id));
    });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Doadores'>
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
                    <th scope='col'>Nome</th>
                    <th scope='col'>E-mail</th>
                    <th scope='col'>CPF</th>
                    <th scope='col'>Data de Nascimento</th>
                    <th scope='col'>Sexo</th>
                    <th scope='col'>Celular</th>
                    <th scope='col'>Tipo Sanguíneo</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {doadores.map((doador) => (
                    <tr key={doador.id}>
                      <td>{doador.nome}</td>
                      <td>{doador.email}</td>
                      <td>{doador.cpf}</td>
                      <td>{doador.dtNasc}</td>
                      <td>{doador.sexo}</td>
                      <td>{doador.celular}</td>
                      <td>{doador.tipoS}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(doador.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(doador.id)}
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

export default ListagemDoadores;
