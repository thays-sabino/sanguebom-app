import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import Card from '../components/card';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import {
  nivelEstoque,
  NIVEL_CRITICO,
  NIVEL_ALERTA,
  classeTextoNivel,
  LIMITE_CRITICO,
  LIMITE_ESTAVEL,
} from '../services/estoque';

const baseURL = `${BASE_URL}/estoques`;

// Classe do Bootstrap para a barra de cada nível
function classeBarra(nivel) {
  if (nivel === NIVEL_CRITICO) return 'bg-danger';
  if (nivel === NIVEL_ALERTA) return 'bg-warning';
  return 'bg-success';
}

// Frase de apoio do card: quanto falta para mudar de nível
function fraseNivel(qtd, nivel) {
  if (nivel === NIVEL_CRITICO) {
    return `Faltam ${(LIMITE_CRITICO - qtd).toLocaleString('pt-BR')} ml para sair do crítico`;
  }
  if (nivel === NIVEL_ALERTA) {
    return `Faltam mais de ${(LIMITE_ESTAVEL - qtd).toLocaleString('pt-BR')} ml para ficar estável`;
  }
  return `${(qtd - LIMITE_ESTAVEL).toLocaleString('pt-BR')} ml acima do limite estável`;
}

function ListagemEstoques() {
  const navigate = useNavigate();

  const editar = (id) => {
    navigate(`/cadastro-estoque/${id}`);
  };

  const [estoques, setEstoques] = useState([]);
  const [hemocentros, setHemocentros] = useState([]);
  const [tipoS, setTipoS] = useState([]);

  // Hemocentro cujo estoque aparece nos cards
  const [idHemocentroCards, setIdHemocentroCards] = useState('');

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setEstoques(response.data);
    });

    axios.get(`${BASE_URL}/hemocentros`).then((response) => {
      setHemocentros(response.data);
      if (response.data.length > 0) {
        setIdHemocentroCards((atual) => atual || String(response.data[0].id));
      }
    });

    axios.get(`${BASE_URL}/tipoS`).then((response) => {
      setTipoS(response.data);
    });
  }, []);

  function nomeHemocentro(idHemocentro) {
    const hemocentro = hemocentros.find((h) => String(h.id) === String(idHemocentro));
    return hemocentro ? hemocentro.razaoSocial : '';
  }

  function nomeTipoS(idTipoS) {
    const tipo = tipoS.find((t) => String(t.id) === String(idTipoS));
    return tipo ? tipo.tipo : '';
  }

  // Quantidade em ml de um tipo no hemocentro escolhido (0 se não houver estoque cadastrado)
  function quantidadeDoTipo(idTipoS) {
    return estoques
      .filter(
        (e) =>
          String(e.idHemocentro) === String(idHemocentroCards) &&
          String(e.idTipoS) === String(idTipoS)
      )
      .reduce((soma, e) => soma + Number(e.qtdMl), 0);
  }

  // Tabela na mesma ordem dos tipos sanguíneos (A+, A-, B+, B-, AB+, AB-, O+, O-),
  // agrupada por hemocentro
  function posicaoDoTipo(idTipoS) {
    const posicao = tipoS.findIndex((t) => String(t.id) === String(idTipoS));
    return posicao === -1 ? Number.MAX_SAFE_INTEGER : posicao;
  }

  const estoquesOrdenados = [...estoques].sort(
    (a, b) =>
      Number(a.idHemocentro) - Number(b.idHemocentro) ||
      posicaoDoTipo(a.idTipoS) - posicaoDoTipo(b.idTipoS)
  );

  return (
    <div className='container tema-secundario'>
      <Card title='Listagem de Estoques'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>

              {/* Visão geral: um card por tipo sanguíneo */}
              <div className='row mb-3'>
                <div className='col-md-6'>
                  <label htmlFor='selectHemocentroCards' className='form-label'>
                    Nível de estoque do hemocentro:
                  </label>
                  <select
                    id='selectHemocentroCards'
                    value={idHemocentroCards}
                    className='form-control'
                    onChange={(e) => setIdHemocentroCards(e.target.value)}
                  >
                    {hemocentros.map((hemocentro) => (
                      <option key={hemocentro.id} value={String(hemocentro.id)}>
                        {hemocentro.razaoSocial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='row g-3 mb-2'>
                {tipoS.map((tipo) => {
                  const qtd = quantidadeDoTipo(tipo.id);
                  const nivel = nivelEstoque(qtd);
                  const porcentagem = Math.min(100, (qtd / LIMITE_ESTAVEL) * 100);

                  return (
                    <div className='col-6 col-md-3' key={tipo.id}>
                      <div className='card h-100'>
                        <div className='card-body'>
                          <div className='d-flex justify-content-between align-items-baseline'>
                            <span
                              className='fw-bold'
                              style={{ fontSize: '2.25rem', lineHeight: 1.1 }}
                            >
                              {tipo.tipo}
                            </span>
                            <span className={`fw-semibold ${classeTextoNivel(nivel)}`}>
                              {nivel}
                            </span>
                          </div>
                          <p className='h3 mt-1 mb-2'>
                            {qtd.toLocaleString('pt-BR')} <small>ml</small>
                          </p>
                          <div
                            className='progress'
                            style={{ height: '8px' }}
                            role='progressbar'
                            aria-label={`Estoque de ${tipo.tipo}`}
                            aria-valuenow={Math.round(porcentagem)}
                            aria-valuemin='0'
                            aria-valuemax='100'
                          >
                            <div
                              className={`progress-bar ${classeBarra(nivel)}`}
                              style={{ width: `${porcentagem}%` }}
                            />
                          </div>
                          <small className='text-muted d-block mt-2'>
                            {fraseNivel(qtd, nivel)}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legenda dos níveis, abaixo dos cards */}
              <br />
              <div className='position-relative mt-4 mb-4 text-muted' style={{ fontSize: '0.75rem' }}>
                <div>Crítico: abaixo de {LIMITE_CRITICO} ml.</div>
                <div>Em alerta: de {LIMITE_CRITICO} a {LIMITE_ESTAVEL} ml.</div>
                <div>Estável: acima de {LIMITE_ESTAVEL} ml.</div>
                <div>A barra completa equivale a {LIMITE_ESTAVEL} ml.</div>
              </div>

              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Hemocentro</th>
                      <th scope='col'>Tipo Sanguíneo</th>
                      <th scope='col'>Quantidade Ml</th>
                      <th scope='col'>Nível</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoquesOrdenados.map((estoque) => {
                      const nivel = nivelEstoque(estoque.qtdMl);

                      return (
                        <tr key={estoque.id}>
                          <td>{nomeHemocentro(estoque.idHemocentro)}</td>
                          <td>{nomeTipoS(estoque.idTipoS)}</td>
                          <td>{estoque.qtdMl}</td>
                          <td className={`fw-semibold ${classeTextoNivel(nivel)}`}>
                            {nivel}
                          </td>
                          <td>
                            <Stack spacing={1} padding={0} direction='row'>
                              <IconButton
                                aria-label='edit'
                                onClick={() => editar(estoque.id)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Stack>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemEstoques;