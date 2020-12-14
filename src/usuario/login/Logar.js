import React from 'react';
import { Link } from 'react-router-dom';
import {
  Form, Input, Button, Icon, notification,
} from 'antd';
import { logar } from '../../util/APIUtils';
import './Logar.css';
import { TOKEN_ACESSO } from '../../constantes';

/**
 * O componente Login renderiza o formulário de login chama a API de login para
 * autenticar um usuário.
 */

const Logar = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onLogin } = props;
  const onFinish = (values) => {
    const logarRequest = { ...values };
    logar(logarRequest)
      .then((response) => {
        localStorage.setItem(TOKEN_ACESSO, response.tokenAcesso);
        onLogin();
      }).catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: 'App de Enquetes',
            description: 'Seu nome de usuário ou senha está incorreta. Por favor tente novamente!',
          });
        } else if (error.sucesso === false) {
          notification.error({
            message: 'App de Enquetes',
            description: error.mensagem,
          });
        } else {
          notification.error({
            message: 'App de Enquetes',
            description: error.message || 'Desculpe! Algo deu errado. Por favor tente novamente!',
          });
        }
      });
  };

  return (
    <div className="login-container">
      <h1 className="page-title">Login</h1>
      <div className="login-content">
        <Form onFinish={onFinish} className="login-form">
          <Form.Item name="nomeUsuarioOuEmail" rules={[{ required: true, message: 'Por favor entre com seu nome de usuario ou email!' }]}>
            <Input
              prefix={<Icon type="user" />}
              size="large"
              name="nomeUsuarioOuEmail"
              placeholder="Nome de Usuário ou Email"
            />
          </Form.Item>
          <Form.Item name="senha" rules={[{ required: true, message: 'Por favor entre com sua senha!' }]}>
            <Input
              prefix={<Icon type="lock" />}
              size="large"
              name="senha"
              type="password"
              placeholder="Senha"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="login-form-button">Logar</Button>
            Or
            {' '}
            <Link to="/inscrever">Inscrever-se Agora!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Logar;
