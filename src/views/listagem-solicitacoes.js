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

const baseURL = `${BASE_URL}/solicitacoes`;

function ListagemSolicitacoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-solicitacoes`);
  };

  const editar = (id) => {
    navigate(`/cadastro-solicitacoes/${id}`);
  };

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setSolicitacoes(response.data);
    });

    axios.get(`${BASE_URL}/hemocentros`).then((response) => {
      setHemocentros(response.data);
    });

    axios.get(`${BASE_URL}/instituicoes`).then((response) => {
      setInstituicoes(response.data);
    });
  }, []);

  function nomeHemocentro(idHemocentro) {
    const hemocentro = hemocentros.find((h) => h.id === idHemocentro);
    return hemocentro ? hemocentro.nome : '';
  }

  function nomeInstituicao(idInstituicao) {
    const instituicao = instituicoes.find((i) => i.id === idInstituicao);
    return instituicao ? instituicao.nome : '';
  }

  async function excluir(id) {
    await axios.delete(`${baseURL}/${id}`).then(() => {
      setSolicitacoes(solicitacoes.filter((solicitacao) => solicitacao.id !== id));
    });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Solicitações'>
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
                    <th scope='col'>Quantidade Solicitada</th>
                    <th scope='col'>Quantidade Liberada</th>
                    <th scope='col'>Urgência</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Hemocentro</th>
                    <th scope='col'>Instituição</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.map((solicitacao) => (
                    <tr key={solicitacao.id}>
                      <td>{solicitacao.id}</td>
                      <td>{solicitacao.tipoS}</td>
                      <td>{solicitacao.qtdSolicitada}</td>
                      <td>{solicitacao.qtdLiberada}</td>
                      <td>{solicitacao.urgencia}</td>
                      <td>{solicitacao.status}</td>
                      <td>{nomeHemocentro(solicitacao.idHemocentro)}</td>
                      <td>{nomeInstituicao(solicitacao.idInstituicao)}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(solicitacao.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(solicitacao.id)}
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

export default ListagemSolicitacoes;
