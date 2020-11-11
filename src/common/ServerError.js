import React from 'react';
import './ServerError.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

/**
 * Outros componentes usam isso para renderizar uma página 500 Server Error se
 * alguma API responder com um erro 500 que o componente não consegue lidar.
 */

function ServerError() {
  return (
    <div className="server-error-page">
      <h1 className="server-error-title">
        500
      </h1>
      <div className="server-error-desc">
        Oops! Algo de errado aconteceu com seu servidor.
      </div>
      <Link to="/"><Button className="server-error-go-back-btn" type="primary" size="large">Voltar</Button></Link>
    </div>
  );
}

export default ServerError;
