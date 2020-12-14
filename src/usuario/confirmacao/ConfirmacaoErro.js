import React from 'react';
import './Confirmacao.css';
import {
  Form, Input, Button, notification,
} from 'antd';
import { TAMANHO_MAX_EMAIL } from '../../constantes';
import { reenviarEmailVerificacao } from '../../util/APIUtils';

class ConfirmacaoErro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  submit = () => {
    const { email } = this.state;
    const emailValidacao = this.validarEmail(email);
    if (emailValidacao.validateStatus === 'error') {
      notification.error({
        message: 'App de Enquetes',
        description: emailValidacao.errorMsg,
      });
    } else {
      reenviarEmailVerificacao(this.state)
        .then(() => {
          notification.success({
            message: 'App de Enquetes',
            description: 'Email de verificação reenviado com sucesso.',
          });
        }).catch((error) => {
          notification.error({
            message: 'App de Enquetes',
            description: error.mensagem || 'Deculpe! Algo deu errado. Por favor tente novamente!',
          });
        });
    }
  };

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

  render() {
    const { email } = this.state;
    const { submit } = this;
    return (
      <div className="confirmacao-container">
        <h1 className="page-title">Erro</h1>
        <p> A tentativa de ativar sua conta falhou. </p>
        <p> Pode ser que o tempo de verificação expirou.</p>
        <br />
        <p> Caso queira solicitar um novo email para verificação. Preencha o campo abaixo:</p>
        <Form onFinish={submit} className="login-form">
          <Form.Item label="Email">
            <Input
              name="email"
              type="email"
              autoComplete="off"
              placeholder="Email cadastrado"
              value={email}
              onChange={(event) => this.setState({ email: event.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="confirmacao-form-button">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default ConfirmacaoErro;
