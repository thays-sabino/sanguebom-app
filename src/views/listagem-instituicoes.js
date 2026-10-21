import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListagemInstituicoes() {
  const [instituicoes, setInstituicoes] = useState([]);

  useEffect(() => {
    axios.get('/db.json')
      .then(response => {
        setInstituicoes(response.data.instituicoes);
      })
      .catch(error => {
        console.error("Erro ao buscar as instituições", error);
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Listagem de Instituições</h2>
      <hr />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Responsável Técnico</th>
            <th>CPF - Responsável Téc.</th>
            <th>Telefone</th>
            <th>ID Usuário</th>
          </tr>
        </thead>
        <tbody>
          {instituicoes.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.razaoSocial}</td>
              <td>{user.cnpj}</td>
              <td>{user.responsavelTec}</td>
              <td>{user.cpfRT}</td>
              <td>{user.telefone}</td>
              <td>{user.idUsuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemInstituicoes;
