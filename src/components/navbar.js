//import React from 'react';
import React, {useState} from 'react';

import 'bootswatch/dist/flatly/bootstrap.css';

import NavbarItem from './navbarItem';

function Navbar(props) {
  /*Controla se o menu mobile sera aberto*/
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-light bg-white'>
      <div className='container'>
        <a href='/' className='navbar-brand d-flex align-item-center'>
          <img
            src='/logo512.svg'
            alt='Sangue Bom'
            style={{height: '55px', width: 'auto'}}
          />
        </a>

        <button
          className='navbar-toggler'
          type='button'
          onClick={() => setMenuAberto(!menuAberto)}
          aria-controls='navbarResponsive'
          aria-expanded={menuAberto}
          aria-label='Toggle navigation'

          /*data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
          */
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        
        <div className={`collapse navbar-collapse ${menuAberto ? 'show' : ''}`} 
        id='navbarResponsive'
        onClick={() => setMenuAberto(false)}>

          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-usuarios'
              label='Usuários'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-doadores'
              label='Doadores'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-hemocentros'
              label='Hemocentros'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-instituicoes'
              label='Instituições'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-adms'
              label='Administração'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-tipoS'
              label='Tipo Sanguíneo'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-convocacoes'
              label='Convocações'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-solicitacoes'
              label='Solicitações'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-doacoes'
              label='Doações'
            />
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem
              render='true'
              href='/listagem-estoques'
              label='Estoques'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
