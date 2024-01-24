import React, { Fragment, useState, useEffect, Component } from 'react';
import ListarUsuario from '../mantenimientos/Usuario/ListarUsuario';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class MantUsuario extends Component {

    componentDidMount() {
        if (!cookies.get('Sgm_cUsuario')) {
            window.location.href = "./login";
        }
    };

    render() {
        return (
            <div >

                <div>
                    <h3>Mantenimiento - Usuarios</h3>
                </div>

                <ListarUsuario />
            </div>
        );
    }
};

export default MantUsuario;
