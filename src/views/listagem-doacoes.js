
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemDoacoes() {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setDoacoes(response.data.doacoes);
      })
      .catch(error => {
        console.error("Erro ao buscar doações:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Doações</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo Sanguíneo</th>
            <th>Quantidade Doada</th>
            <th>ID Usuario</th>
            <th>ID Usuario</th>            
          </tr>
        </thead>
        <tbody>
          {doacoes.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipoS}</td>
              <td>{user.qtdDoada}</td>
              <td>{user.idUsuario}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemDoacoes;
