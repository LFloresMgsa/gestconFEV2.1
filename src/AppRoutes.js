import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Categorias from './views/Categorias';
import Login from './views/Login';
import Logout from './views/Logout';
import Soporte from './Soporte.js';


import EditaUsuario from './mantenimientos/Usuario/EditarUsuario';
import ListaUsuario from './mantenimientos/Usuario/ListarUsuario';
import CrearUsuario from './mantenimientos/Usuario/CrearUsuario';

import ListarRestricciones from './mantenimientos/Restricciones/ListarRestricciones';
import CrearRestricciones from './mantenimientos/Restricciones/CrearRestricciones';
import EditarRestricciones from './mantenimientos/Restricciones/EditarRestricciones';

import ListarArchivosUsua from './mantenimientos/ArchivosporUsuarios/ListarArchivos.js';


import { storage } from "./storage.js";

const AppRoutes = (props) => {
  const { accessToken, currentUser } = props;
  const _Usuario = storage.GetStorage("_u752826:bed2f264e06439f5015536dc9", localStorage);
  const [validaLogeo, setValidaLogeo] = useState(_Usuario || '')

  // console.log(validaLogeo);
  // console.log(_Usuario);
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

          {/* ----------- USUARIOS */}
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
          {/* ----------- RESTRICCION */}
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

          {/* ----------- ARCHIVOS POR USUARIOS */}
          <Route
            path="/MantArchivos"
            render={(route) => <ListarArchivosUsua {...props} {...route} />}
          />

        </>
      ) : (
        <Route
          path="/gestcon"
          render={(route) => <Dashboard {...props} {...route} />}
        />
      )}

      <Route render={() => <Redirect to="/gestcon" />} />
    </Switch>
  );
};

export default AppRoutes;
