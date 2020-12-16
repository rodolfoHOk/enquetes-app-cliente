import React from 'react';
import { Link } from 'react-router-dom';
import './Senha.css';

function MudarSenhaErro() {
  return (
    <div className="senha-container">
      <h1 className="page-title">Mudar Senha</h1>
      <p> Erro ao tentar acessar a página de mudança de senha.</p>
      <p> Pode ser que sua autorização para mudança de senha tenha expirado.</p>
      <br />
      <Link to="/logar">Logar agora</Link>
      <br />
      Ou
      {' '}
      <Link to="/esqueci-senha">Pedir novamente</Link>
    </div>
  );
}

export default MudarSenhaErro;
