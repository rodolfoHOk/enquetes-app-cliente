// Este arquivo é o principal ponto de entrada do nosso aplicativo react

/*
 * No script abaixo, simplesmente renderizamos o componente App em um elemento DOM com raiz de id
 * (este elemento DOM está disponível no arquivo public / index.html).
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);

registerServiceWorker();
