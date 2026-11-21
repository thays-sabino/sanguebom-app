import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';
import Navbar from './components/navbar.js';
import Rotas from './rotas.js';

class App extends React.Component {
  render() {
    return (
      <div>
        <Rotas />
        <Navbar />
      </div>
    );
  }
}

export default App;

/** REMOVI 'CONTAINER' DA DIV PARA QUE A FAIX CINZA NA HOME PREENCHESSE A TELA TODA */
