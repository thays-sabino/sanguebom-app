import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemDoadores() {
  const [doadores, setDoadores] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setDoadores(response.data.doadores);
      })
      .catch(error => {
        console.error("Erro ao buscar doadores:", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Doadores</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Sexo</th>
            <th>Celular</th>
            <th>Tipo Sanguíneo</th>
            <th>ID Usuario</th>            
          </tr>
        </thead>
        <tbody>
          {doadores.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.cpf}</td>
              <td>{user.dtNasc}</td>
              <td>{user.sexo}</td>
              <td>{user.celular}</td>
              <td>{user.tipoS}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemDoadores;



