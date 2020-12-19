/* eslint-disable prefer-template */
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Tabs } from 'antd';
import EnqueteLista from '../../enquete/EnqueteLista';
import { getPerfilUsuario } from '../../util/APIUtils';
import getCorAvatar from '../../util/Cores';
import { formatarData } from '../../util/Auxiliar';
import IndicadorCarregamento from '../../common/IndicadorCarregamento';
import './Perfil.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

const { TabPane } = Tabs;

/**
 * A Profile renderiza o perfil público de um usuário.
 * Ele exibe as informações básicas do usuário, a lista de enquetes que o usuário criou
 * e a lista de enquetes nas quais o usuário votou.
 */

class Perfil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      isCarregando: false,
    };
    this.carregarPerfilUsuario = this.carregarPerfilUsuario.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { match } = this.props;
    // eslint-disable-next-line react/prop-types
    const { params } = match;
    // eslint-disable-next-line react/prop-types
    const { nomeUsuario } = params;
    this.carregarPerfilUsuario(nomeUsuario);
  }

  componentDidUpdate(nextProps) {
    // eslint-disable-next-line react/prop-types
    const { match } = this.props;
    // eslint-disable-next-line react/prop-types
    const { params } = match;
    // eslint-disable-next-line react/prop-types
    const { nomeUsuario } = params;
    // eslint-disable-next-line react/prop-types
    if (nomeUsuario !== nextProps.match.params.nomeUsuario) {
      // eslint-disable-next-line react/prop-types
      this.carregarPerfilUsuario(nextProps.match.params.nomeUsuario);
    }
  }

  carregarPerfilUsuario(nomeUsuario) {
    this.setState({
      isCarregando: true,
    });
    getPerfilUsuario(nomeUsuario)
      .then((response) => {
        this.setState({
          usuario: response,
          isCarregando: false,
        });
      }).catch((error) => {
        if (error.status === 404) {
          this.setState({
            notFound: true,
            isCarregando: false,
          });
        } else {
          this.setState({
            serverError: true,
            isCarregando: false,
          });
        }
      });
  }

  render() {
    const { isCarregando, notFound, serverError } = this.state;
    if (isCarregando) {
      return <IndicadorCarregamento />;
    }

    if (notFound) {
      return <NotFound />;
    }

    if (serverError) {
      return <ServerError />;
    }

    const tabBarStyle = {
      textAlign: 'center',
    };

    const { usuario } = this.state;

    // eslint-disable-next-line react/prop-types
    const { match } = this.props;
    // eslint-disable-next-line react/prop-types
    const { params } = match;
    // eslint-disable-next-line react/prop-types
    const { nomeUsuario } = params;

    return (
      <div className="profile">
        {
          usuario ? (
            <div className="user-profile">
              <div className="user-details">
                <div className="user-avatar">
                  <Avatar className="user-avatar-circle" style={{ backgroundColor: getCorAvatar(usuario.nome) }}>
                    {usuario.nome[0].toUpperCase()}
                  </Avatar>
                </div>
                <div className="user-summary">
                  <div className="full-name">{usuario.nome}</div>
                  <div className="username">
                    @
                    {usuario.nomeUsuario}
                  </div>
                  <div className="user-joined">
                    Ingressou:
                    {' '}
                    {formatarData(usuario.entrouEm)}
                  </div>
                  <div className="user-profile-edit">
                    <Link to="/perfil/editar">Editar Perfil</Link>
                  </div>
                </div>
              </div>
              <div className="user-poll-details">
                <Tabs
                  defaultActiveKey="1"
                  animated={false}
                  tabBarStyle={tabBarStyle}
                  size="large"
                  className="profile-tabs"
                >
                  <TabPane tab={usuario.contagemEnquetes + ' Enquetes'} key="1">
                    <EnqueteLista nomeUsuario={nomeUsuario} tipo="ENQUETES_CRIADAS_USUARIO" />
                  </TabPane>
                  <TabPane tab={usuario.contagemVotos + ' Votos'} key="2">
                    <EnqueteLista nomeUsuario={nomeUsuario} tipo="ENQUETES_VOTADAS_USUARIO" />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default Perfil;
