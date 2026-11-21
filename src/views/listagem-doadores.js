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

const baseURL = `${BASE_URL}/doadores`;
const usuariosURL = `${BASE_URL}/usuarios`;
const tipoSURL = `${BASE_URL}/tipoS`;

function ListagemDoadores() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-doadores`);
  };

  const editar = (id) => {
    navigate(`/cadastro-doadores/${id}`);
  };

  const [doadores, setDoadores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tipoS, setTipoS] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDoadores(response.data);
    });

    axios.get(usuariosURL).then((response) => {
      setUsuarios(response.data);
    });

    axios.get(tipoSURL).then((response) => {
      setTipoS(response.data);
    });
  }, []);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setDoadores(doadores.filter((doador) => doador.id !== id));
        mensagemSucesso('Doador excluído com sucesso!');
      })
      .catch(() =>{
        mensagemErro('Erro ao excluir o doador.');
      });
  }

  function nomeTipoSanguineo(idTipoS) {
    const tipoEncontrado = tipoS.find(
      (t) => String(t.id) === String(idTipoS)
    );
    return tipoEncontrado ? tipoEncontrado.tipo : '';
  }

  return (
    <div className='container tema-secundario'>
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
              <div className='table-responsive'>
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
                    {doadores.map((doador) => {
                      const usuarioEncontrado = usuarios.find(
                        (u) => String(u.id) === String(doador.idUsuario)
                      );
                    
                    return(
                      <tr key={doador.id}>
                        <td>{doador.nome}</td>
                        <td>{usuarioEncontrado ? usuarioEncontrado.email : 'E-mail não encontrado'}</td>
                        <td>{doador.cpf}</td>
                        <td>{doador.dtNasc}</td>
                        <td>{doador.sexo}</td>
                        <td>{doador.celular}</td>
                        <td>{nomeTipoSanguineo(doador.idTipoS)}</td>
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

export default ListagemDoadores;
