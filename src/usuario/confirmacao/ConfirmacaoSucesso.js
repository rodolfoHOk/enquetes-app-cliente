import React from 'react';
import { Link } from 'react-router-dom';
import './Confirmacao.css';

function ConfirmacaoSucesso() {
  return (
    <div className="confirmacao-container">
      <h1 className="page-title">Congratulações</h1>
      <p> Parabéns. Sua conta foi ativada e o email verificado. </p>
      <br />
      <Link to="/logar">Logar agora</Link>
    </div>
  );
}

export default ConfirmacaoSucesso;
