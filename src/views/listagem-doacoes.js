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

const baseURL = `${BASE_URL}/doacoes`;

function ListagemDoacoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-doacoes`);
  };

  const editar = (id) => {
    navigate(`/cadastro-doacoes/${id}`);
  };

  const [doacoes, setDoacoes] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [tipoS, setTipoS] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDoacoes(response.data);
    });

    axios.get(`${BASE_URL}/hemocentros`).then((response) => {
      setHemocentros(response.data);
    });

    axios.get(`${BASE_URL}/doadores`).then((response) => {
      setDoadores(response.data);
    });

    axios.get(`${BASE_URL}/tipoS`).then((response) => {
      setTipoS(response.data);
    });
  }, []);

  function nomeHemocentro(idHemocentro) {
    const hemocentro = hemocentros.find((h) => String(h.id) === String(idHemocentro));
    return hemocentro ? hemocentro.razaoSocial : '';
  }

  function nomeDoador(idDoador) {
    const doador = doadores.find((d) => String(d.id) === String(idDoador));
    return doador ? doador.nome : '';
  }

  function nomeTipoSanguineo(idDoador) {
    const doador = doadores.find((d) => String(d.id) === String(idDoador));
    if (!doador) return '';

    const tipo = tipoS.find((t) => String(t.id) === String(doador.idTipoS));
    return tipo ? tipo.tipo : '';
  }

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setDoacoes(doacoes.filter((doacao) => doacao.id !== id));
        mensagemSucesso('Doação excluída com sucesso!');
      })
      .catch(() => {
        mensagemErro('Erro ao excluir a doação.');
      });
  }

  return (
    <div className='container tema-secundario'>
      <Card title='Listagem de Doações'>
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
                      <th scope='col'>Hemocentro</th>
                      <th scope='col'>Doador</th>
                      <th scope='col'>Data</th>
                      <th scope='col'>Tipo Sanguíneo</th>
                      <th scope='col'>Quantidade Doada</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doacoes.map((doacao) => (
                      <tr key={doacao.id}>
                        <td>{doacao.id}</td>
                        <td>{nomeHemocentro(doacao.idHemocentro)}</td>
                        <td>{nomeDoador(doacao.idDoador)}</td>
                        <td>{doacao.dtDoacao}</td>
                        <td>{nomeTipoSanguineo(doacao.idDoador)}</td>
                        <td>{doacao.qtdDoada}</td>
                        <td>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => editar(doacao.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label='delete'
                              onClick={() => excluir(doacao.id)}
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

export default ListagemDoacoes;
