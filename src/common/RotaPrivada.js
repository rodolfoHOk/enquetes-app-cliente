import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

/**
 * Um metacomponente que redireciona para / login se o usuário está tentando acessar uma
 * página protegida sem autenticação.
 */
// eslint-disable-next-line react/prop-types
const RotaPrivada = ({ component: Component, autenticado, ...rest }) => (
  <Route
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
    render={(props) => (autenticado ? (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Component {...rest} {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/logar',
          // eslint-disable-next-line react/prop-types
          state: { from: props.location },
        }}
      />
    ))}
  />
);

export default RotaPrivada;
