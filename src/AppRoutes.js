import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Categorias from './views/Categorias';
import Login from './views/Login';
import Logout from './views/Logout';
import Soporte from './views/Soporte';
import Mantenimiento from './views/Mantenimiento';
import ListaUsuario from './mantenimientos/Usuario/ListarUsuario';
import EditaUsuario from './mantenimientos/Usuario/EditarUsuario';
const AppRoutes = (props) => {
  const { accessToken, currentUser } = props;

  return (
    <Switch>
      <Route exact path="/" render={(route) => <Dashboard {...props} {...route} />}>
        <Redirect to="/gestcon" />
      </Route>
      <Route path="/gestcon" render={(route) => <Dashboard {...props} {...route} />} />
      <Route
        path="/categoria"
        render={(route) => <Categorias {...props} {...route} pCategory="" pTipo="publico" />}
      />
      <Route
        exact
        path="/logout"
        render={(route) => <Logout {...props} {...route} />}
      />
      <Route
        path="/usuario"
        render={(route) => <ListaUsuario {...props} {...route} />}
      />

<Route
        path="/editar"
        render={(route) => <EditaUsuario {...props} {...route} />}
      />

      {/* <Route
        exact
        path="/soporte"
        render={(route) => <Soporte {...props} {...route} />}
      /> */}
      {/* <Route
        exact
        path="/mantenimiento"
        render={(route) => <Soporte {...props} {...route} />}
      /> */}
      <Route
        path="/gerencia"
        render={(route) => <Categorias {...props} {...route} pCategory="" pTipo="publico" />}
      />
      <Route
        path="/sistemas"
        render={(route) => <Categorias {...props} {...route} pCategory="" pTipo="seguro" />}
      />
      {/* Wildcard route to catch unknown paths and redirect to "/gestcon" */}
      <Route render={() => <Redirect to="/gestcon" />} />
    </Switch>
  );
};

export default AppRoutes;
