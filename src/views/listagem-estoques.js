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

const baseURL = `${BASE_URL}/estoques`;

function ListagemEstoques() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-estoque`);
  };

  const editar = (id) => {
    navigate(`/cadastro-estoque/${id}`);
  };

  const [estoques, setEstoques] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setEstoques(response.data);
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
        setEstoques(estoques.filter((estoque) => estoque.id !== id));
        mensagemSucesso('Estoque excluído com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir o estoque.');
      });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Estoques'>
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
                    <th scope='col'>Hemocentro</th>
                    <th scope='col'>Tipo Sanguíneo</th>
                    <th scope='col'>Quantidade Ml</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {estoques.map((estoque) => (
                    <tr key={estoque.id}>
                      <td>{nomeHemocentro(estoque.idHemocentro)}</td>

                      <td>{estoque.tipoS}</td>

                      <td>{estoque.qtdMl}</td>
                      
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(estoque.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(estoque.id)}
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

export default ListagemEstoques;
