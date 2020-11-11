/* eslint-disable prefer-template */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Form, Input, Button, notification,
} from 'antd';
import { inscrever, checarNomeUsuarioDisponivel, checarEmailDisponivel } from '../../util/APIUtils';
import './Inscrever.css';
import {
  TAMANHO_MIN_NOME, TAMANHO_MAX_NOME,
  TAMANHO_MIN_NOME_USUARIO, TAMANHO_MAX_NOME_USUARIO,
  TAMANHO_MAX_EMAIL,
  TAMANHO_MIN_SENHA, TAMANHO_MAX_SENHA,
} from '../../constantes';

const FormItem = Form.Item;

/**
 * Esta renderiza o formulário de registro e contém várias validações do lado do cliente.
 * É um componente interessante para verificar se você deseja aprender como fazer validações
 * de formulário no React.
 */
class Inscrever extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: {
        value: '',
      },
      nomeUsuario: {
        value: '',
      },
      email: {
        value: '',
      },
      senha: {
        value: '',
      },
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmeter = this.handleSubmeter.bind(this);
    this.validarNomeUsuarioDisponivel = this.validarNomeUsuarioDisponivel.bind(this);
    this.validarEmailDisponivel = this.validarEmailDisponivel.bind(this);
    this.isFormInvalido = this.isFormInvalido.bind(this);
  }

  // Validation Functions
  validarNome = (nome) => {
    if (nome.length < TAMANHO_MIN_NOME) {
      return {
        validateStatus: 'error',
        errorMsg: 'Nome é muito curto (Mínimo ' + TAMANHO_MIN_NOME + ' caracteres necessários.)',
      };
    } if (nome.length > TAMANHO_MAX_NOME) {
      return {
        validationStatus: 'error',
        errorMsg: 'Nome é muito longo (Máximo ' + TAMANHO_MAX_NOME + ' caracteres permitidos.)',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
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
        errorMsg: 'Email é muito longo (Máximo ' + TAMANHO_MAX_EMAIL + ' caracteres permitidos)',
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  }

  validarNomeUsuario = (nomeUsuario) => {
    if (nomeUsuario.length < TAMANHO_MIN_NOME_USUARIO) {
      return {
        validateStatus: 'error',
        errorMsg: 'Nome de usuário é muito curto (Mínimo ' + TAMANHO_MIN_NOME_USUARIO + ' caracteres necessários.)',
      };
    } if (nomeUsuario.length > TAMANHO_MAX_NOME_USUARIO) {
      return {
        validationStatus: 'error',
        errorMsg: 'Nome de usuário é muito longo (Máximo ' + TAMANHO_MAX_NOME_USUARIO + ' caracteres permitidos.)',
      };
    }
    return {
      validateStatus: null,
      errorMsg: null,
    };
  }

  validarSenha = (senha) => {
    if (senha.length < TAMANHO_MIN_SENHA) {
      return {
        validateStatus: 'error',
        errorMsg: 'Senha é muito curta (Mínimo ' + TAMANHO_MIN_SENHA + ' caracteres necessários.)',
      };
    } if (senha.length > TAMANHO_MAX_SENHA) {
      return {
        validationStatus: 'error',
        errorMsg: 'Senha é muito longa (Máximo ' + TAMANHO_MAX_SENHA + ' caracteres permitidos.)',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  validarNomeUsuarioDisponivel() {
    // Primeiro checa pelo lado do cliente erros no nome de usuário
    const { nomeUsuario } = this.state;
    const nomeUsuarioValue = nomeUsuario.value;
    const nomeUsuarioValidacao = this.validarNomeUsuario(nomeUsuarioValue);

    if (nomeUsuarioValidacao.validateStatus === 'error') {
      this.setState({
        nomeUsuario: {
          value: nomeUsuarioValue,
          ...nomeUsuarioValidacao,
        },
      });
      return;
    }

    this.setState({
      nomeUsuario: {
        value: nomeUsuarioValue,
        validateStatus: 'validating',
        errorMsg: null,
      },
    });

    checarNomeUsuarioDisponivel(nomeUsuarioValue)
      .then((response) => {
        if (response.disponivel) {
          this.setState({
            nomeUsuario: {
              value: nomeUsuarioValue,
              validateStatus: 'success',
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            nomeUsuario: {
              value: nomeUsuarioValue,
              validateStatus: 'error',
              errorMsg: 'Este nome de usuário já está em uso',
            },
          });
        }
      // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        // Marcando validateStatus como sucesso, o formulário será verificado novamente no servidor.
        this.setState({
          nomeUsuario: {
            value: nomeUsuarioValue,
            validateStatus: 'success',
            errorMsg: null,
          },
        });
      });
  }

  validarEmailDisponivel() {
    // Primiro checa pelo lado do cliente por erros no email
    const { email } = this.state;
    const emailValue = email.value;
    const emailValidacao = this.validarEmail(emailValue);

    if (emailValidacao.validateStatus === 'error') {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidacao,
        },
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: 'validating',
        errorMsg: null,
      },
    });

    checarEmailDisponivel(emailValue)
      .then((response) => {
        if (response.disponivel) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: 'success',
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: 'error',
              errorMsg: 'Este e-mail já está registado',
            },
          });
        }
        // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        // Marcando validateStatus como sucesso, o formulário será verificado novamente no servidor
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'success',
            errorMsg: null,
          },
        });
      });
  }

  isFormInvalido() {
    const {
      nome,
      email,
      nomeUsuario,
      senha,
    } = this.state;
    return !(nome.validateStatus === 'success'
            && nomeUsuario.validateStatus === 'success'
            && email.validateStatus === 'success'
            && senha.validateStatus === 'success'
    );
  }

  handleChangeInput(event, validacaoFun) {
    const { target } = event;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validacaoFun(inputValue),
      },
    });
  }

  handleSubmeter() {
    // event.preventDefault(); não necessário no onFinish do form do ant design.
    const {
      nome,
      email,
      nomeUsuario,
      senha,
    } = this.state;
    const inscreverRequest = {
      nome: nome.value,
      email: email.value,
      nomeUsuario: nomeUsuario.value,
      senha: senha.value,
    };
    inscrever(inscreverRequest)
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        notification.success({
          message: 'App de Enquetes',
          description: 'Obrigado! Você está registrado com sucesso. Por favor faça o login para continuar!',
        });
        // eslint-disable-next-line react/prop-types
        const { history } = this.props;
        // eslint-disable-next-line react/prop-types
        history.push('/logar');
      }).catch((error) => {
        notification.error({
          message: 'App de Enquetes',
          description: error.message || 'Deculpe! Algo deu errado. Por favor tente novamente!',
        });
      });
  }

  render() {
    const {
      nome,
      email,
      nomeUsuario,
      senha,
    } = this.state;
    return (
      <div className="signup-container">
        <h1 className="page-title">Inscrever-se</h1>
        <div className="signup-content">
          <Form onFinish={this.handleSubmeter} className="signup-form">
            <FormItem
              label="Nome Completo"
              validateStatus={nome.validateStatus}
              help={nome.errorMsg}
            >
              <Input
                size="large"
                name="nome"
                autoComplete="off"
                placeholder="Seu nome completo"
                value={nome.value}
                onChange={(event) => this.handleChangeInput(event, this.validarNome)}
              />
            </FormItem>
            <FormItem
              label="Nome Usuario"
              hasFeedback
              validateStatus={nomeUsuario.validateStatus}
              help={nomeUsuario.errorMsg}
            >
              <Input
                size="large"
                name="nomeUsuario"
                autoComplete="off"
                placeholder="Um nome de usuário único"
                value={nomeUsuario.value}
                onBlur={this.validarNomeUsuarioDisponivel}
                onChange={(event) => this.handleChangeInput(event, this.validarNomeUsuario)}
              />
            </FormItem>
            <FormItem
              label="Email"
              hasFeedback
              validateStatus={email.validateStatus}
              help={email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Seu email"
                value={email.value}
                onBlur={this.validarEmailDisponivel}
                onChange={(event) => this.handleChangeInput(event, this.validarEmail)}
              />
            </FormItem>
            <FormItem
              label="Senha"
              validateStatus={senha.validateStatus}
              help={senha.errorMsg}
            >
              <Input
                size="large"
                name="senha"
                type="password"
                autoComplete="off"
                placeholder="Uma senha com 6 a 20 caracteres"
                value={senha.value}
                onChange={(event) => this.handleChangeInput(event, this.validarSenha)}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormInvalido()}
              >
                Inscrever-se
              </Button>
              Já registrado?
              {' '}
              <Link to="/logar">Logar agora!</Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default Inscrever;
