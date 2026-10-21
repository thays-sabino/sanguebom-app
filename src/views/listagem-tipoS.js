import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate } from 'react-router-dom';

function ListagemTipoS() {
  const navigate = useNavigate();

  const editar = (id) => {
    navigate(`/cadastro-tipoS/${id}`);
  };

  const [tipoS, setTipoS] = useState([]);

  async function excluir(id) {
    setTipoS(tipoS.filter((dado) => dado.id !== id));
  }

  React.useEffect(() => {
    axios.get('/db.json').then((response) => {
      setTipoS(response.data.tipoS);
    });
  }, []);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setTipoS(response.data.tipoS);
      })
      .catch(error => {
        console.error("Erro ao buscar tipos sanguíneos:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Tipos Sanguíneos</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tipoS.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipo}</td>
              <td>
                <Stack spacing={1} padding={0} direction='row'>
                  <IconButton
                    aria-label='edit'
                    onClick={() => editar(user.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    onClick={() => excluir(user.id)}
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
  );
}

export default ListagemTipoS;



