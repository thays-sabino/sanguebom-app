import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemConvocacoes() {
  const [convocacoes, setConvocacoes] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setConvocacoes(response.data.convocacoes);
      })
      .catch(error => {
        console.error("Erro ao buscar convocações:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Convocações</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo Sanguíneo</th>
            <th>Urgencia</th>
            <th>Status</th>
            <th>ID Usuario</th>            
          </tr>
        </thead>
        <tbody>
          {convocacoes.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipoS}</td>
              <td>{user.urgencia}</td>
              <td>{user.status}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemConvocacoes;
