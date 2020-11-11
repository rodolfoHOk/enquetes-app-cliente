/* eslint-disable prefer-template */
import React from 'react';
import './NovaEnquete.css';
import {
  Form, Input, Button, Icon, Select, Col, notification,
} from 'antd';
import { criarEnquete } from '../util/APIUtils';
import { OPCAO_NUM_MAX, ENQUETE_TAMANHO_MAX_PERGUNTA, ENQUETE_TAMANHO_MAX_OPCAO } from '../constantes';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * Renderiza o formulário de criação de enquete.
 */
class NovaEnquete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pergunta: {
        texto: '',
      },
      opcoes: [{
        texto: '',
      }, {
        texto: '',
      }],
      duracaoEnquete: {
        dias: 1,
        horas: 0,
      },
    };
    this.adicionarOpcao = this.adicionarOpcao.bind(this);
    this.removerOpcao = this.removerOpcao.bind(this);
    this.handleSubmeter = this.handleSubmeter.bind(this);
    this.handleChangePergunta = this.handleChangePergunta.bind(this);
    this.handleChangeOpcao = this.handleChangeOpcao.bind(this);
    this.handleChangeDiasEnquete = this.handleChangeDiasEnquete.bind(this);
    this.handleChangeHorasEnquete = this.handleChangeHorasEnquete.bind(this);
    this.isFormatoInvalido = this.isFormatoInvalido.bind(this);
  }

  validarPergunta = (textoPergunta) => {
    if (textoPergunta.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Por favor entre com a opção!',
      };
    } if (textoPergunta.length > ENQUETE_TAMANHO_MAX_PERGUNTA) {
      return {
        validateStatus: 'error',
        errorMsg: 'Pegunta é muito longa (Máximo ' + ENQUETE_TAMANHO_MAX_PERGUNTA + 'caracteres permitidos)',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  validarOpcao = (textoOpcao) => {
    if (textoOpcao.length === 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Por favor entre com uma opção!',
      };
    } if (textoOpcao.length > ENQUETE_TAMANHO_MAX_OPCAO) {
      return {
        validateStatus: 'error',
        errorMsg: 'Opcao é muito longa (Máximo ' + ENQUETE_TAMANHO_MAX_OPCAO + ' caracteres permitidos)',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  adicionarOpcao() {
    const { opcoes } = this.state;
    const opcoesNova = opcoes.slice();
    this.setState({
      opcoes: opcoesNova.concat([{
        text: '',
      }]),
    });
  }

  removerOpcao(numeroOpcao) {
    const { opcoes } = this.state;
    const opcoesNova = opcoes.slice();
    this.setState({
      opcoes: [...opcoesNova.slice(0, numeroOpcao), ...opcoesNova.slice(numeroOpcao + 1)],
    });
  }

  handleSubmeter() {
    // event.preventDefault(); não necessário no onFinish do form do ant design.
    const { pergunta, opcoes, duracaoEnquete } = this.state;
    const enqueteDados = {
      pergunta: pergunta.texto,
      opcoes: opcoes.map((opcao) => ({ texto: opcao.texto })),
      duracaoEnquete,
    };

    criarEnquete(enqueteDados)
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        // eslint-disable-next-line react/prop-types
        const { history } = this.props;
        // eslint-disable-next-line react/prop-types
        history.push('/');
      }).catch((erro) => {
        if (erro.status === 401) {
          // eslint-disable-next-line react/prop-types
          const { handleDeslogar } = this.props;
          handleDeslogar('/logar', 'erro', 'Você deve estar desconectado. Por favor logue para criar enquete.');
        } else {
          notification.error({
            message: 'App de Enquetes',
            description: erro.message || 'Desculpe! Algo deu errado. Por favor tente novamente!',
          });
        }
      });
  }

  handleChangePergunta(event) {
    const { value } = event.target;
    this.setState({
      pergunta: {
        texto: value,
        ...this.validarPergunta(value),
      },
    });
  }

  handleChangeOpcao(event, index) {
    const { opcoes } = this.state;
    const opcoesNova = opcoes.slice();
    const { value } = event.target;

    opcoesNova[index] = {
      texto: value,
      ...this.validarOpcao(value),
    };

    this.setState({
      opcoes: opcoesNova,
    });
  }

  handleChangeDiasEnquete(valor) {
    const { duracaoEnquete } = this.state;
    const duracaoEnqueteNova = Object.assign(duracaoEnquete, { dias: valor });
    this.setState({
      duracaoEnquete: duracaoEnqueteNova,
    });
  }

  handleChangeHorasEnquete(valor) {
    const { duracaoEnquete } = this.state;
    const duracaoEnqueteNova = Object.assign(duracaoEnquete, { horas: valor });
    this.setState({
      duracaoEnquete: duracaoEnqueteNova,
    });
  }

  isFormatoInvalido() {
    const { pergunta } = this.state;
    if (pergunta.statusValidacao !== 'sucesso') {
      return true;
    }

    const { opcoes } = this.state;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < opcoes.length; i++) {
      const opcao = opcoes[i];
      if (opcao.statusValidacao !== 'sucesso') {
        return true;
      }
    }

    return false;
  }

  render() {
    const opcaoViews = [];

    const { opcoes } = this.state;
    opcoes.forEach((opcao, index) => {
      opcaoViews.push(<OpcaoEnquete
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        opcao={opcao}
        numeroOpcao={index}
        removerOpcao={this.removerOpcao}
        handleChangeOpcao={this.handleChangeOpcao}
      />);
    });
    const { pergunta, duracaoEnquete } = this.state;
    return (
      <div className="new-poll-container">
        <h1 className="page-title">Criar Enquete</h1>
        <div className="new-poll-content">
          <Form onFinish={this.handleSubmeter} className="create-poll-form">
            <FormItem
              validateStatus={pergunta.validateStatus}
              help={pergunta.errorMsg}
              className="poll-form-row"
            >
              <TextArea
                placeholder="Entre com a sua pergunta"
                style={{ fontSize: '16px' }}
                autosize={{ minRows: 3, maxRows: 6 }}
                name="pergunta"
                value={pergunta.texto}
                onChange={this.handleChangePergunta}
              />
            </FormItem>
            {opcaoViews}
            <FormItem className="poll-form-row">
              <Button type="dashed" onClick={this.adicionarOpcao} disabled={opcoes.length === OPCAO_NUM_MAX}>
                <Icon type="plus" />
                {' '}
                Adicionar uma Opção
              </Button>
            </FormItem>
            <FormItem className="poll-form-row">
              <Col xs={24} sm={4}>
                Duração enquete:
              </Col>
              <Col xs={24} sm={20}>
                <span style={{ marginRight: '18px' }}>
                  <Select
                    name="dias"
                    defaultValue="1"
                    onChange={this.handleChangeDiasEnquete}
                    value={duracaoEnquete.dias}
                    style={{ width: 60 }}
                  >
                    {
                      Array.from(Array(8).keys()).map((i) => <Option key={i}>{i}</Option>)
                    }
                  </Select>
                  {' '}
                  &nbsp;Dias
                </span>
                <span>
                  <Select
                    name="horas"
                    defaultValue="0"
                    onChange={this.handleChangeHorasEnquete}
                    value={duracaoEnquete.horas}
                    style={{ width: 60 }}
                  >
                    {
                      Array.from(Array(24).keys()).map((i) => <Option key={i}>{i}</Option>)
                    }
                  </Select>
                  {' '}
                  &nbsp;Horas
                </span>
              </Col>
            </FormItem>
            <FormItem className="poll-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormatoInvalido}
                className="create-poll-form-button"
              >
                Criar Enquete
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

function OpcaoEnquete(props) {
  const {
    // eslint-disable-next-line react/prop-types
    opcao,
    // eslint-disable-next-line react/prop-types
    numeroOpcao,
    // eslint-disable-next-line react/prop-types
    handleChangeOpcao,
    // eslint-disable-next-line react/prop-types
    removerOpcao,
  } = props;
  return (
    <FormItem
      // eslint-disable-next-line react/prop-types
      validateStatus={opcao.validateStatus}
      // eslint-disable-next-line react/prop-types
      help={opcao.errorMsg}
      className="poll-form-row"
    >
      <Input
        placeholder={'Opção ' + (numeroOpcao + 1)}
        size="large"
        // eslint-disable-next-line react/prop-types
        value={opcao.texto}
        className={numeroOpcao > 1 ? 'optional-choice' : null}
        onChange={(event) => handleChangeOpcao(event, numeroOpcao)}
      />

      {
        numeroOpcao > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="close"
            disabled={numeroOpcao <= 1}
            onClick={() => removerOpcao(numeroOpcao)}
          />
        ) : null
      }
    </FormItem>
  );
}

export default NovaEnquete;
