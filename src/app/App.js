/**
 * O componente App é o principal componente de nível superior de nosso aplicativo. Ele define o
 * layout principal e o roteamento, carrega o usuário atualmente conectado e passa as
 * propriedades currentUser e isAuthenticated para outros componentes.
 */
import React from 'react';
import './App.css';
import { Route, withRouter, Switch } from 'react-router-dom';
import { Layout, notification } from 'antd';
import { getUsuarioAtual } from '../util/APIUtils';
import { TOKEN_ACESSO } from '../constantes';

import EnqueteLista from '../enquete/EnqueteLista';
import NovaEnquete from '../enquete/NovaEnquete';
import Logar from '../usuario/login/Logar';
import Inscrever from '../usuario/signup/Inscrever';
import ConfirmacaoSucesso from '../usuario/confirmacao/ConfirmacaoSucesso';
import ConfirmacaoErro from '../usuario/confirmacao/ConfirmacaoErro';
import EsqueciSenha from '../usuario/senha/EsqueciSenha';
import MudarSenha from '../usuario/senha/MudarSenha';
import MudarSenhaErro from '../usuario/senha/MudarSenhaErro';
import Perfil from '../usuario/profile/Perfil';
import Cabecalho from '../common/Cabecalho';
import NotFound from '../common/NotFound';
import IndicadorCarregamento from '../common/IndicadorCarregamento';
import RotaPrivada from '../common/RotaPrivada';

const { Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioAtual: null,
      isAutenticado: false,
      isCarregando: false,
    };
    this.handleDeslogar = this.handleDeslogar.bind(this);
    this.carregarUsuarioAtual = this.carregarUsuarioAtual.bind(this);
    this.handleLogar = this.handleLogar.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  componentDidMount() {
    this.carregarUsuarioAtual();
  }

  carregarUsuarioAtual() {
    this.setState({
      isCarregando: true,
    });
    getUsuarioAtual()
      .then((response) => {
        this.setState({
          usuarioAtual: response,
          isAutenticado: true,
          isCarregando: false,
        });
      }).catch(() => {
        this.setState({
          isCarregando: false,
        });
      });
  }

  /**
   * Manipula o logout, define o estado usuarioAtual e isAutenticado que será passado para outros
   * componentes.
   */
  handleDeslogar(redirectTo = '/', notificationType = 'success', description = 'Você deslogou com sucesso.') {
    localStorage.removeItem(TOKEN_ACESSO);

    this.setState({
      usuarioAtual: null,
      isAutenticado: false,
    });

    // eslint-disable-next-line react/prop-types
    const { history } = this.props;
    // eslint-disable-next-line react/prop-types
    history.push(redirectTo);

    notification[notificationType]({
      message: 'App de Enquetes',
      description,
    });
  }

  /**
   * Este método é chamado pelo componente Login após o login bem sucedido
   * para que possamos carregar os detalhes do usuário conectado e definir o currentUser &
   * estado isAuthenticated, que outros componentes usarão para renderizar seu JSX.
   */
  handleLogar() {
    notification.success({
      message: 'App de Enquetes',
      description: 'Você logou com sucesso.',
    });
    this.carregarUsuarioAtual();

    // eslint-disable-next-line react/prop-types
    const { history } = this.props;
    // eslint-disable-next-line react/prop-types
    history.push('/');
  }

  render() {
    const { isCarregando, isAutenticado, usuarioAtual } = this.state;
    if (isCarregando) {
      return <IndicadorCarregamento />;
    }
    return (
      <Layout className="app-container">
        <Cabecalho
          isAutenticado={isAutenticado}
          usuarioAtual={usuarioAtual}
          onDeslogar={this.handleDeslogar}
        />

        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <EnqueteLista
                    isAutenticado={isAutenticado}
                    usuarioAtual={usuarioAtual}
                    handleDeslogar={this.handleDeslogar}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
              />
              <Route
                path="/logar"
                // eslint-disable-next-line react/jsx-props-no-spreading
                render={(props) => <Logar onLogin={this.handleLogar} {...props} />}
              />
              <Route path="/inscrever" component={Inscrever} />
              <Route path="/confirmacao-conta/sucesso" component={ConfirmacaoSucesso} />
              <Route path="/confirmacao-conta/erro" component={ConfirmacaoErro} />
              <Route path="/esqueci-senha" component={EsqueciSenha} />
              <Route path="/mudar-senha/mudar" component={MudarSenha} />
              <Route path="/mudar-senha/erro" component={MudarSenhaErro} />
              <Route
                path="/usuarios/:nomeUsuario"
                render={(props) => (
                  <Perfil
                    isAutenticado={isAutenticado}
                    usuarioAtual={usuarioAtual}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
              />
              <RotaPrivada autenticado={isAutenticado} path="/enquete/nova" component={NovaEnquete} handleDeslogar={this.handleDeslogar} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
