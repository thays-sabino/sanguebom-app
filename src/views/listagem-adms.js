import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemAdms() {
  const [adms, setAdms] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setAdms(response.data.adms);
      })
      .catch(error => {
        console.error("Erro ao buscar administradores:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Administradores</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Usuário</th>
          </tr>
        </thead>
        <tbody>
          {adms.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemAdms;
