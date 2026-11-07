import React from 'react';

import Home from './views/home';

import ListagemUsuarios from './views/listagem-usuarios';
import CadastroUsuarios from './views/cadastro-usuario';

import ListagemAdms from './views/listagem-adms';
import CadastroAdms from './views/cadastro-adm';

import ListagemDoadores from './views/listagem-doadores';
import CadastroDoadores from './views/cadastro-doadores';

import ListagemHemocentros from './views/listagem-hemocentros';
import CadastroHemocentros from './views/cadastro-hemocentro';

import ListagemInstituicoes from './views/listagem-instituicoes';
import CadastroInstituicoes from './views/cadastro-instituicoes';

import ListagemTipoS from './views/listagem-tipoS';
import CadastroTipoS from './views/cadastro-tipoS';

import ListagemConvocacoes from './views/listagem-convocacoes';
import CadastroConvocacoes from './views/cadastro-convocacoes';

import ListagemEstoques from './views/listagem-estoques';
import CadastroEstoques from './views/cadastro-estoque';

import ListagemSolicitacoes from './views/listagem-solicitacoes';
import CadastroSolicitacoes from './views/cadastro-solicitacoes';

import ListagemDoacoes from './views/listagem-doacoes';
import CadastroDoacoes from './views/cadastro-doacoes';

import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Página Inicial */}
        <Route
          path='/'
          element={<Home />} />
        <Route
          path='*'
          element={<Navigate to='/' replace />} />

        {/* Usuários */}
        <Route
          path='/listagem-usuarios/'
          element={<ListagemUsuarios />} />
        <Route
          path='/cadastro-usuario/'
          element={<CadastroUsuarios />} />

        {/* Administradores */}
        <Route
          path='/listagem-adms/'
          element={<ListagemAdms />}
        />
        <Route
          path='/cadastro-adms/'
          element={<CadastroAdms />}
        />
        <Route
          path='/cadastro-adms/:idParam'
          element={<CadastroAdms />}
        />

        {/* Doadores */}
        <Route
          path='/listagem-doadores/'
          element={<ListagemDoadores />}
        />
        <Route
          path='/cadastro-doadores/'
          element={<CadastroDoadores />}
        />
        <Route
          path='/cadastro-doadores/:idParam'
          element={<CadastroDoadores />}
        />

        {/* Hemocentros */}
        <Route
          path='/listagem-hemocentros/'
          element={<ListagemHemocentros />}
        />
        <Route
          path='/cadastro-hemocentro/'
          element={<CadastroHemocentros />}
        />
        <Route
          path='/cadastro-hemocentro/:idParam'
          element={<CadastroHemocentros />}
        />

        {/* Instituições */}
        <Route
          path='/listagem-instituicoes/'
          element={<ListagemInstituicoes />}
        />
        <Route
          path='/cadastro-instituicoes/'
          element={<CadastroInstituicoes />}
        />
        <Route
          path='/cadastro-instituicoes/:idParam'
          element={<CadastroInstituicoes />}
        />

        {/* Tipos sanguíneos */}
        <Route
          path='/listagem-tipoS/'
          element={<ListagemTipoS />}
        />
        <Route
          path='/cadastro-tipoS/'
          element={<CadastroTipoS />}
        />
        <Route
          path='/cadastro-tipoS/:idParam'
          element={<CadastroTipoS />}
        />

        {/* Convocações */}
        <Route
          path='/listagem-convocacoes/'
          element={<ListagemConvocacoes />}
        />
        <Route
          path='/cadastro-convocacoes/'
          element={<CadastroConvocacoes />}
        />
        <Route
          path='/cadastro-convocacoes/:idParam'
          element={<CadastroConvocacoes />}
        />

        {/* Estoques */}
        <Route
          path='/listagem-estoques/'
          element={<ListagemEstoques />}
        />
        <Route
          path='/cadastro-estoque/'
          element={<CadastroEstoques />}
        />
        <Route
          path='/cadastro-estoque/:idParam'
          element={<CadastroEstoques />}
        />

        {/* Solicitações */}
        <Route
          path='/listagem-solicitacoes/'
          element={<ListagemSolicitacoes />}
        />
        <Route
          path='/cadastro-solicitacoes/'
          element={<CadastroSolicitacoes />}
        />
        <Route
          path='/cadastro-solicitacoes/:idParam'
          element={<CadastroSolicitacoes />}
        />

        {/* Doações */}
        <Route
          path='/listagem-doacoes/'
          element={<ListagemDoacoes />}
        />
        <Route
          path='/cadastro-doacoes/'
          element={<CadastroDoacoes />}
        />
        <Route
          path='/cadastro-doacoes/:idParam'
          element={<CadastroDoacoes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
