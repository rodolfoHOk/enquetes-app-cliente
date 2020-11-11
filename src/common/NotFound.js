import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

/**
 * Usamos isso no componente do aplicativo para renderizar uma página 404 Not Found se
 * nenhuma das rotas corresponder ao url atual.
 */

function NotFound() {
  return (
    <div className="page-not-found">
      <h1 className="title">
        404
      </h1>
      <div className="desc">
        A Página que você procura não foi encontrada.
      </div>
      <Link to="/"><Button className="go-back-btn" type="primary" size="large">Voltar</Button></Link>
    </div>
  );
}

export default NotFound;
