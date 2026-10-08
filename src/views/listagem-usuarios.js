import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setUsuarios(response.data.usuarios);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Usuários</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Senha</th>
            <th>Senha Repetição</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.senha}</td>
              <td>{user.senhaRepeticao}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemUsuarios;
