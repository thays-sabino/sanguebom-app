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

const baseURL = `${BASE_URL}/instituicoes`;

function ListagemInstituicoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-instituicoes`);
  };

  const editar = (id) => {
    navigate(`/cadastro-instituicoes/${id}`);
  };

  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setInstituicoes(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setInstituicoes(
          instituicoes.filter((instituicao) => instituicao.id !== id)
        );
        mensagemSucesso('Instituição excluída com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir a instituição.');
      });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Instituições'>
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
                      <th scope='col'>ID</th>
                      <th scope='col'>Nome</th>
                      <th scope='col'>E-mail</th>
                      <th scope='col'>Razão Social</th>
                      <th scope='col'>CNPJ</th>
                      <th scope='col'>Responsável Técnico</th>
                      <th scope='col'>CPF - Responsável Téc.</th>
                      <th scope='col'>Telefone</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instituicoes.map((instituicao) => (
                      <tr key={instituicao.id}>
                        <td>{instituicao.id}</td>
                        <td>{instituicao.nome}</td>
                        <td>{instituicao.email}</td>
                        <td>{instituicao.razaoSocial}</td>
                        <td>{instituicao.cnpj}</td>
                        <td>{instituicao.responsavelTec}</td>
                        <td>{instituicao.cpfRT}</td>
                        <td>{instituicao.telefone}</td>
                        <td>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => editar(instituicao.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label='delete'
                              onClick={() => excluir(instituicao.id)}
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
        </div>
      </Card>
    </div>
  );
}

export default ListagemInstituicoes;