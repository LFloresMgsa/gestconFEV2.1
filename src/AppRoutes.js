import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Categorias from './views/Categorias';
import Login from './views/Login';
import Logout from './views/Logout';
import Soporte from './views/Soporte';
import Mantenimiento from './views/Mantenimiento';

import EditaUsuario from './mantenimientos/Usuario/EditarUsuario';
import ListaUsuario from './mantenimientos/Usuario/ListarUsuario';
import CrearUsuario from './mantenimientos/Usuario/CrearUsuario';

import ListarRestricciones from './mantenimientos/Restricciones/ListarRestricciones';
import CrearRestricciones from './mantenimientos/Restricciones/CrearRestricciones';
import EditarRestricciones from './mantenimientos/Restricciones/EditarRestricciones';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


const AppRoutes = (props) => {
  const { accessToken, currentUser } = props;

  const [validaLogeo, setValidaLogeo] = useState(cookies.get('Sgm_cUsuario') || '')


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



      {validaLogeo !== null && validaLogeo.trim() !== '' ? (
        <>
          <Route
            path="/crear"
            render={(route) => <CrearUsuario {...props} {...route} />}
          />
          <Route
            path="/MantUsuario"
            render={(route) => <ListaUsuario {...props} {...route} />}
          />

          <Route
            path="/editar"
            render={(route) => <EditaUsuario {...props} {...route} />}
          />

          <Route
            path="/crearRestric"
            render={(route) => <CrearRestricciones {...props} {...route} />}
          />
          <Route
            path="/MantRestric"
            render={(route) => <ListarRestricciones {...props} {...route} />}
          />
          <Route
            path="/editarRestric"
            render={(route) => <EditarRestricciones {...props} {...route} />}
          />
        </>
      ) : (
        <Route
          path="/gestcon"
          render={(route) => <Dashboard {...props} {...route} />}
        />
      )}





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
      {/* <Route
        path="/gerencia"
        render={(route) => <Categorias {...props} {...route} pCategory="" pTipo="publico" />}
      />
      <Route
        path="/sistemas"
        render={(route) => <Categorias {...props} {...route} pCategory="" pTipo="seguro" />}
      /> */}
      {/* Wildcard route to catch unknown paths and redirect to "/gestcon" */}
      <Route render={() => <Redirect to="/gestcon" />} />
    </Switch>
  );
};

export default AppRoutes;
