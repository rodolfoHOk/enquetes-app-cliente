/* eslint-disable prefer-template */
import React from 'react';
import {
  notification, Form, Input, Button,
} from 'antd';
import {
  getUsuarioCompleto,
  atualizarUsuario,
  checarEmailDisponivel,
  checarNomeUsuarioDisponivel,
} from '../../util/APIUtils';
import {
  TAMANHO_MIN_NOME, TAMANHO_MAX_NOME,
  TAMANHO_MIN_NOME_USUARIO, TAMANHO_MAX_NOME_USUARIO,
  TAMANHO_MAX_EMAIL,
  TAMANHO_MIN_SENHA, TAMANHO_MAX_SENHA,
} from '../../constantes';
import './EditarPerfil.css';

class EditarPerfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCarregando: false,
      usuario: null,
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
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { usuarioAtual } = this.props;
    // eslint-disable-next-line react/prop-types
    this.carregarUsuarioCompleto(usuarioAtual.id);
  }

  // eslint-disable-next-line react/sort-comp
  carregarUsuarioCompleto(id) {
    this.setState({ isCarregando: true });
    getUsuarioCompleto(id)
      .then((response) => {
        this.setState({
          usuario: response,
          isCarregando: false,
        });
        const { usuario } = this.state;
        this.setState({
          nome: {
            value: usuario.nome,
          },
          nomeUsuario: {
            value: usuario.nomeUsuario,
          },
          email: {
            value: usuario.email,
          },
        });
      }).catch((erro) => {
        notification.error({
          message: 'App de Enquetes',
          description: erro.message || 'Deculpe! Algo deu errado. Por favor tente novamente!',
        });
      });
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
    if (senha.length > 0) {
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
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  validarNomeUsuarioDisponivel = () => {
    // Primeiro checa pelo lado do cliente erros no nome de usuário
    const { nomeUsuario, usuario } = this.state;
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

    if (nomeUsuarioValue !== usuario.nomeUsuario) {
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
    } else {
      this.setState({
        nomeUsuario: {
          value: nomeUsuarioValue,
          validateStatus: 'success',
          errorMsg: null,
        },
      });
    }
  }

  validarEmailDisponivel = () => {
    // Primiro checa pelo lado do cliente por erros no email
    const { email, usuario } = this.state;
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

    if (emailValue !== usuario.email) {
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
    } else {
      this.setState({
        email: {
          value: emailValue,
          validateStatus: 'success',
          errorMsg: null,
        },
      });
    }
  }

  isFormInvalido = () => {
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

  handleMudanca = (event, funcaoValidacao) => {
    const { target } = event;
    const nomeEntrada = target.name;
    const valorEntrada = target.value;

    this.setState({
      [nomeEntrada]: {
        value: valorEntrada,
        ...funcaoValidacao(valorEntrada),
      },
    });
  }

  handleSubmeter = () => {
    const {
      usuario,
      nome,
      nomeUsuario,
      email,
      senha,
    } = this.state;

    const atualizarUsuarioRequisicao = {
      id: usuario.id,
      nome: nome.value,
      nomeUsuario: nomeUsuario.value,
      email: email.value,
      senha: senha.value,
    };

    // eslint-disable-next-line react/prop-types
    const { handleDeslogar } = this.props;

    atualizarUsuario(usuario.id, atualizarUsuarioRequisicao)
      .then((response) => {
        notification.success({
          message: 'App de Enquetes',
          description: response.mensagem,
        });
        handleDeslogar();
      }).catch((erro) => {
        notification.error({
          message: 'App de Enquetes',
          description: erro.mensagem || 'Deculpe! Algo deu errado. Por favor tente novamente!',
        });
      });
  }

  render() {
    const {
      isCarregando,
      nome,
      nomeUsuario,
      email,
      senha,
    } = this.state;
    return (
      <div className="signup-container">
        <h1 className="page-title">Atualizar dados do usuário</h1>
        <div className="signup-content">
          {
           isCarregando ? 'Carregando...' : null
          }
          <Form onFinish={this.handleSubmeter} className="signup-form">
            <Form.Item
              label="Nome Completo"
              validateStatus={nome.validateStatus}
              help={nome.errorMsg}
            >
              <Input
                size="large"
                name="nome"
                value={nome.value}
                onChange={(event) => this.handleMudanca(event, this.validarNome)}
              />
            </Form.Item>
            <Form.Item
              label="Nome de Usuário"
              hasFeedBack
              validateStatus={nomeUsuario.validateStatus}
              help={nomeUsuario.errorMsg}
            >
              <Input
                size="large"
                name="nomeUsuario"
                value={nomeUsuario.value}
                onBlur={this.validarNomeUsuarioDisponivel}
                onChange={(event) => this.handleMudanca(event, this.validarNomeUsuario)}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              hasFeedBack
              validateStatus={email.validateStatus}
              help={email.errorMsg}
            >
              <Input
                size="large"
                name="email"
                type="email"
                value={email.value}
                onBlur={this.validarEmailDisponivel}
                onChange={(event) => this.handleMudanca(event, this.validarEmail)}
              />
            </Form.Item>
            <Form.Item
              label="Senha"
              validateStatus={senha.validateStatus}
              help={senha.errorMsg}
            >
              <Input
                size="large"
                name="senha"
                type="password"
                value={senha.value}
                placeholder="Manter a mesma senha"
                onChange={(event) => this.handleMudanca(event, this.validarSenha)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button"
                disabled={this.isFormInvalido}
              >
                Atualizar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditarPerfil;
