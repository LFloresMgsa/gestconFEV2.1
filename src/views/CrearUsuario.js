import React, { Fragment, useState, useEffect, Component } from 'react';
import CrearUsuario from '../mantenimientos/Usuario/CrearUsuario';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class MantUsuario extends Component {

    componentDidMount() {
        if (!cookies.get('Sgm_cUsuario')) {
            window.location.href = "./gestcon";
        }
    };

    render() {
        return (
            <div >
                <CrearUsuario />
            </div>
        );
    }
};

export default MantUsuario;
