import React, { useState, useEffect } from 'react';

import Card from '../components/card';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/tipoS`;

function ListagemTipoS() {

  const [tipoS, setTipoS] = useState([]);

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setTipoS(response.data);
    });
  }, []);

  return (
    <div className='container tema-secundario'>
      <Card title='Listagem de Tipos Sanguíneos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              {/* Um card por tipo sanguíneo: 4 por linha no computador e 2 no celular */}
              <div className='row g-3 mb-2'>
                {tipoS.map((tipo) => (
                  <div className='col-6 col-md-3' key={tipo.id}>
                    {/* m-0: o custom.css dá margens a todo .card, o que fazia a última linha encostar na borda do card externo */}
                    <div className='card h-100 m-0'>
                      <div className='card-body d-flex align-items-center justify-content-center py-4'>
                        <span
                          className='fw-bold text-danger'
                          style={{ fontSize: '2.5rem', lineHeight: 1.1 }}
                        >
                          {tipo.tipo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemTipoS;