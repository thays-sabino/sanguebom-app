
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemEstoques() {
  const [estoques, setEstoques] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setEstoques(response.data.estoques);
      })
      .catch(error => {
        console.error("Erro ao buscar os estoques", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Estoques</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Quantidade Ml</th>
            <th>ID Usuário</th>
          </tr>
        </thead>
        <tbody>
          {estoques.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipoS}</td>
              <td>{user.qtdMl}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemEstoques;
