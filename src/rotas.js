import React from 'react';

import ListagemUsuarios from './views/listagem-usuarios';
import ListagemDoadores from './views/listagem-doadores';
import ListagemHemocentros from './views/listagem-hemocentros';
import ListagemInstituicoes from './views/listagem-instituicoes';
import ListagemAdms from './views/listagem-adms';
import ListagemTipoSanguineo from './views/listagem-tipoSanguineo';
import ListagemConvocacoes from './views/listagem-convocacoes';
import ListagemSolicitacoes from './views/listagem-solicitacoes';


import { Route, Routes, BrowserRouter } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/listagem-usuarios/'
          element={<ListagemUsuarios />}
        />
        <Route
          path='/listagem-doadores/'
          element={<ListagemDoadores />}
        />
        <Route
          path='/listagem-hemocentros/'
          element={<ListagemHemocentros />}
        />
        <Route
          path='/listagem-instituicoes/'
          element={<ListagemInstituicoes />}
        />
        <Route
          path='/listagem-adms/'
          element={<ListagemAdms />}
        />
        <Route
          path='/listagem-tipoSanguineo/'
          element={<ListagemTipoSanguineo />}
        />
        <Route
          path='/listagem-convocacoes/'
          element={<ListagemConvocacoes />}
        />
        <Route
          path='/listagem-solicitacoes/'
          element={<ListagemSolicitacoes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;