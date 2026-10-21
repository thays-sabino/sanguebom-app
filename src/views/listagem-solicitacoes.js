import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setSolicitacoes(response.data.solicitacoes);
      })
      .catch(error => {
        console.error("Erro ao buscar as solicitações", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Solicitações</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Quantidade Solicitada</th>
            <th>Quantidade Liberada</th>
            <th>Urgência</th>
            <th>Status</th>
            <th>ID Hemocentro</th>
            <th>ID Doadores</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipoS}</td>
              <td>{user.qtdSolicitada}</td>
              <td>{user.qtdLiberada}</td>
              <td>{user.urgencia}</td>
              <td>{user.status}</td>
              <td>{user.idUsuario}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemSolicitacoes;
