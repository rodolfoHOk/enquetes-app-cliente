/* eslint-disable react/no-unused-state */
import React from 'react';
import { Button, Icon, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import {
  getTodasEnquetes, getEnquetesCriadasUsuario, getEnquetesVotadasUsuario, votar,
} from '../util/APIUtils';
import Enquete from './Enquete';

import IndicadorCarregamento from '../common/IndicadorCarregamento';
import { ENQUETE_TAMANHO_LISTA } from '../constantes';
import './EnqueteLista.css';

/**
 * Este componente é usado para renderizar uma lista de enquetes.
 * É usado para processar todas as enquetes na página inicial.
 * Também usamos isso na página de perfil do usuário para renderizar a lista de enquetes
 * criadas por aquele usuário e a lista de enquetes em que esse usuário votou.
 */
class EnqueteLista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enquetes: [],
      pagina: 0,
      tamanho: 10,
      totalElementos: 0,
      totalPaginas: 0,
      ultima: true,
      votosAtual: [],
      isCarregando: false,
    };
    this.carregarListaEnquetes = this.carregarListaEnquetes.bind(this);
    this.handleCarregarMais = this.handleCarregarMais.bind(this);
  }

  componentDidMount() {
    this.carregarListaEnquetes();
  }

  componentDidUpdate(nextProps) {
    // eslint-disable-next-line react/prop-types
    const { isAutenticado } = this.props;
    // eslint-disable-next-line react/prop-types
    if (isAutenticado !== nextProps.isAutenticado) {
      this.resetState();
      this.carregarListaEnquetes();
    }
  }

  // Reset State
  resetState = () => {
    this.setState({
      enquetes: [],
      pagina: 0,
      tamanho: 10,
      totalElementos: 0,
      totalPaginas: 0,
      ultima: true,
      votosAtual: [],
      isCarregando: false,
    });
  }

  carregarListaEnquetes(pagina = 0, tamanho = ENQUETE_TAMANHO_LISTA) {
    let promise;
    // eslint-disable-next-line react/prop-types
    const { nomeUsuario, tipo } = this.props;
    if (nomeUsuario) {
      if (tipo === 'ENQUETES_CRIADAS_USUARIO') {
        promise = getEnquetesCriadasUsuario(nomeUsuario, pagina, tamanho);
      } else if (tipo === 'ENQUETES_VOTADAS_USUARIO') {
        promise = getEnquetesVotadasUsuario(nomeUsuario, pagina, tamanho);
      }
    } else {
      promise = getTodasEnquetes(pagina, tamanho);
    }

    if (!promise) {
      return;
    }

    this.setState({
      isCarregando: true,
    });

    promise
      .then((response) => {
        const { enquetes } = this.state;
        enquetes.slice();
        const { votosAtual } = this.state;
        votosAtual.slice();

        this.setState({
          enquetes: enquetes.concat(response.content),
          paginas: response.page,
          tamanho: response.size,
          totalElementos: response.totalElements,
          totalPaginas: response.totalPages,
          ultima: response.last,
          votosAtual: votosAtual.concat(Array(response.content.length).fill(null)),
          isCarregando: false,
        });
      // eslint-disable-next-line no-unused-vars
      }).catch((error) => {
        this.setState({
          isCarregando: false,
        });
      });
  }

  handleCarregarMais() {
    const { pagina } = this.state;
    this.carregarListaEnquetes(pagina + 1);
  }

  handleChangeVoto(event, enqueteIndex) {
    const { votosAtual } = this.state;
    votosAtual.slice();
    votosAtual[enqueteIndex] = event.target.value;

    this.setState({
      votosAtual,
    });
  }

  handleSubmeterVoto(event, enqueteIndex) {
    event.preventDefault();
    // eslint-disable-next-line react/prop-types
    const { isAutenticado } = this.props;
    if (!isAutenticado) {
      // eslint-disable-next-line react/prop-types
      const { history } = this.props;
      // eslint-disable-next-line react/prop-types
      history.push('/logar');
      notification.info({
        message: 'App de Enquetes',
        description: 'Por favor logar para votar.',
      });
      return;
    }

    const { enquetes, votosAtual } = this.state;
    const enquete = enquetes[enqueteIndex];
    const opcaoSelecionada = votosAtual[enqueteIndex];

    const votoDados = {
      enqueteId: enquete.id,
      opcaoId: opcaoSelecionada,
    };

    votar(votoDados)
      .then((response) => {
        enquetes.slice();
        enquetes[enqueteIndex] = response;
        this.setState({
          enquetes,
        });
      }).catch((error) => {
        if (error.status === 401) {
          // eslint-disable-next-line react/prop-types
          const { handleDeslogar } = this.props;
          handleDeslogar('/logar', 'error', 'Você deve estar deslogado. Por favor logue para votar');
        } else {
          notification.error({
            message: 'App de enquetes',
            description: error.message || 'Desculpe! Algo deu errado. Por favor tente novamente!',
          });
        }
      });
  }

  render() {
    const enqueteViews = [];
    const { enquetes, votosAtual } = this.state;
    enquetes.forEach((enquete, enqueteIndex) => {
      enqueteViews.push(<Enquete
        key={enquete.id}
        enquete={enquete}
        votoAtual={votosAtual[enqueteIndex]}
        handleChangeVoto={(event) => this.handleChangeVoto(event, enqueteIndex)}
        handleSubmeterVoto={(event) => this.handleSubmeterVoto(event, enqueteIndex)}
      />);
    });

    const { isCarregando, ultima } = this.state;
    return (
      <div className="polls-container">
        {enqueteViews}
        {
          !isCarregando && enquetes.length === 0 ? (
            <div className="no-polls-found">
              <span>Enquetes não encontrada.</span>
            </div>
          ) : null
        }
        {
          !isCarregando && !ultima ? (
            <div className="load-more-polls">
              <Button type="dashed" onClick={this.handleCarregarMais} disabled={isCarregando}>
                <Icon type="plus" />
                {' '}
                Carregar Mais
              </Button>
            </div>
          ) : null
        }
        {
          isCarregando
            ? <IndicadorCarregamento /> : null
        }
      </div>
    );
  }
}

export default withRouter(EnqueteLista);
