import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemHemocentros() {
  const [hemocentros, setHemocentros] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setHemocentros(response.data.hemocentros);
      })
      .catch(error => {
        console.error("Erro ao buscar os hemocentros", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Hemocentros</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Usuário</th>
          </tr>
        </thead>
        <tbody>
          {hemocentros.map(user => (
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

export default ListagemHemocentros;
