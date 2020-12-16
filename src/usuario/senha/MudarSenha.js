import React from 'react';
import {
  notification, Form, Button, Input,
} from 'antd';
import { TAMANHO_MIN_SENHA, TAMANHO_MAX_SENHA } from '../../constantes';
import { mudarSenha } from '../../util/APIUtils';
import './Senha.css';

class MudarSenha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      senha: '',
      senhaRepetida: '',
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { location } = this.props;
    // eslint-disable-next-line react/prop-types
    const buscaToken = location.search.substring(7);
    this.setState({ token: buscaToken });
  }

  validarSenha = (senha) => {
    if (senha.length < TAMANHO_MIN_SENHA) {
      return {
        validateStatus: 'error',
        // eslint-disable-next-line prefer-template
        errorMsg: 'Senha é muito curta (Mínimo ' + TAMANHO_MIN_SENHA + ' caracteres necessários.)',
      };
    } if (senha.length > TAMANHO_MAX_SENHA) {
      return {
        validationStatus: 'error',
        // eslint-disable-next-line prefer-template
        errorMsg: 'Senha é muito longa (Máximo ' + TAMANHO_MAX_SENHA + ' caracteres permitidos.)',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  submeter = () => {
    const { senha, senhaRepetida } = this.state;
    const senhaValidacao = this.validarSenha(senha);
    if (senhaValidacao.validateStatus === 'error') {
      notification.error({
        message: 'App de Enquetes',
        description: senhaValidacao.errorMsg,
      });
    } else if (senhaRepetida !== senha) {
      notification.error({
        message: 'App de Enquetes',
        description: 'Campos de senhas não são iguais',
      });
    } else {
      const { token } = this.state;
      const mudarSenhaRequisicao = {
        token,
        senha,
      };
      mudarSenha(mudarSenhaRequisicao)
        .then(() => {
          notification.success({
            message: 'App de Enquetes',
            description: 'Senha mudada com sucesso',
          });
        }).catch((erro) => {
          notification.error({
            message: 'App de Enquetes',
            description: erro.mensagem || 'Deculpe! Algo deu errado. Por favor tente novamente!',
          });
        });
    }
  }

  render() {
    const { senha, senhaRepetida } = this.state;
    const { submeter } = this;
    return (
      <div className="senha-container">
        <h1 className="page-title">Mudar senha</h1>
        <p>Para mudar a senha, preencha os campos abaixo e envie</p>
        <div className="form-content">
          <Form onFinish={submeter} className="login-form">
            <Form.Item label="Senha">
              <Input
                type="password"
                name="senha"
                size="large"
                autoComplete="off"
                placeholder="Digite a nova senha"
                value={senha}
                onChange={(event) => this.setState({ senha: event.target.value })}
              />
            </Form.Item>
            <Form.Item label="Senha Novamente">
              <Input
                type="password"
                name="senhaRepetida"
                size="large"
                autoComplete="off"
                placeholder="Repita a senha"
                value={senhaRepetida}
                onChange={(event) => this.setState({ senhaRepetida: event.target.value })}
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

export default MudarSenha;
