import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemTipoS() {
  const [tipoS, setTipoS] = useState([]);

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
          </tr>
        </thead>
        <tbody>
          {tipoS.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemTipoS;



