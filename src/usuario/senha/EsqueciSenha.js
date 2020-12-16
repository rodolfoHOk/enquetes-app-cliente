import React from 'react';
import {
  notification, Form, Button, Input,
} from 'antd';
import { TAMANHO_MAX_EMAIL } from '../../constantes';
import { esqueciSenha } from '../../util/APIUtils';
import './Senha.css';

class EsqueciSenha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  validarEmail = (email) => {
    if (!email) {
      return {
        validateStatus: 'error',
        errorMsg: 'Campo email não pode ser vazio',
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email não é válido',
      };
    }

    if (email.length > TAMANHO_MAX_EMAIL) {
      return {
        validateStatus: 'error',
        // eslint-disable-next-line prefer-template
        errorMsg: 'Email é muito longo (Máximo ' + TAMANHO_MAX_EMAIL + ' caracteres permitidos)',
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  }

  submeter = () => {
    const { email } = this.state;
    const emailValidacao = this.validarEmail(email);
    if (emailValidacao.validateStatus === 'error') {
      notification.error({
        message: 'App de Enquetes',
        description: emailValidacao.errorMsg,
      });
    } else {
      esqueciSenha(this.state)
        .then(() => {
          notification.success({
            message: 'App de Enquetes',
            description: 'Sucesso. Verifique seu email para prosseguir.',
          });
        }).catch((erro) => {
          notification.error({
            message: 'App de Enquetes',
            description: erro.mensagem || 'Deculpe! Algo deu errado. Por favor tente novamente!',
          });
        });
    }
  };

  render() {
    const { email } = this.state;
    const { submeter } = this;
    return (
      <div className="senha-container">
        <h1 className="page-title">Esqueci a Senha</h1>
        <p>Para requisitar mudança de senha, preenchar o campo abaixo e envie.</p>
        <div className="login-content">
          <Form onFinish={submeter} className="login-form">
            <Form.Item label="Email">
              <Input
                type="email"
                name="email"
                placeholder="Digite seu email cadastrado"
                autoComplete="off"
                value={email}
                onChange={(event) => this.setState({ email: event.target.value })}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="senha-form-button">
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default EsqueciSenha;
