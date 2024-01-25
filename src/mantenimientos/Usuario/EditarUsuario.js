import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { eventoService } from '../../services/evento.service';
import md5 from 'md5';

const EditaUsuario = (props) => {
    const history = useHistory()
    const [data, setData] = useState([])
    const [error, setError] = useState([])
    const [loading, setLoading] = useState([])

    const [Sgm_cUsuario, setUsuario] = useState('')
    const [Sgm_cNombre, setNombre] = useState('')
    const [Sgm_cContrasena, setContrasena] = useState('')
    const [Sgm_cObservaciones, setObservaciones] = useState('')
    const [Sgm_cPerfil, setPerfil] = useState('')

    
    const { location } = props;
    const { usuario } = location.state;

    // Load de Pagina
    useEffect(() => {




        setUsuario(usuario.Sgm_cUsuario);
        setNombre(usuario.Sgm_cNombre);
        setContrasena(usuario.Sgm_cContrasena);
        setObservaciones(usuario.Sgm_cObservaciones);
        setPerfil(usuario.Sgm_cPerfil);

      //  listarusuario()
    }, [])

    // const listarusuario = async () => {
    //     try {
    //         let _body = { Accion: "BUSCARREGISTRO" , Sgm_cUsuario : Sgm_cUsuario , Sgm_cContrasena : Sgm_cContrasena }; // Declarar _body aquí
    
    //         const res = await eventoService.obtenerUsuariov2(_body);
    


    //         if (res && res[0].length > 0) {
    //             const item = res[0][0];
    //             setUsuario(item.Sgm_cUsuario);
    //             setNombre(item.Sgm_cNombre);
    //             setContrasena(item.Sgm_cContrasena);
    //             setObservaciones(item.Sgm_cObservaciones);
    //             setPerfil(item.Sgm_cPerfil);
    //         } else {
    //             setError('Usuario no encontrado');
    //         }
    //     } catch (error) {
    //         console.error('Error al obtener datos:', error);
    //         setError('Error al cargar el usuario');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // procedimiento para EDITAR un catalogo con SP MySQL
    
    
    const editarUsuario = async (e) => {
        try {
            let _body = {   Accion: "EDITAR", Sgm_cUsuario: Sgm_cUsuario, Sgm_cNombre: Sgm_cNombre, 
                            Sgm_cContrasena: md5(Sgm_cContrasena), Sgm_cObservaciones: Sgm_cObservaciones, 
                            Sgm_cPerfil: Sgm_cPerfil }



            await eventoService.obtenerUsuariov2(_body).then(
                (res) => {
                    setData(res[0]);
                },
                (error) => {
                    console.log(error)
                    setError(error);
                }
            );

            alert('El usuario fue actualizado');

        } catch (error) {
            alert(error);

        } finally {
            history.push({
                pathname: '/usuario'
            });
            setLoading(false);
        }
    }

    const cancelar = async (e) => {
        history.push({
            pathname: '/usuario'
        });
        setLoading(false);
    }

    return (

        <div>
            <Paper
                sx={{
                    p: 2,
                    margin: 1,
                    maxWidth: 'auto',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >

                <Box sx={{ flexGrow: 1 }}>
                    <div align="left">
                        <h3 >EDITAR USUARIOS:</h3>
                    </div>

                    <Grid container spacing={2}>

                        <Grid item xs={8}>

                            <TextField
                                label="Usuario"
                                value={Sgm_cUsuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                name="textformat"
                                id="usuario"
                                variant="standard"
                                disabled
                            />
                            <TextField
                                label="Nombre"
                                value={Sgm_cNombre}
                                onChange={(e) => setNombre(e.target.value)}
                                name="textformat"
                                id="nombre"
                                variant="standard"
                                
                            />
                            <TextField
                                label="Contraseña"
                                value={Sgm_cContrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                name="textformat"
                                id="contrasena"
                                variant="standard"
                            />
                            <TextField
                                label="Observaciones"
                                value={Sgm_cObservaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                name="textformat"
                                id="observaciones"
                                variant="standard"
                                
                            />
                            <TextField
                                label="Perfil"
                                value={Sgm_cPerfil}
                                onChange={(e) => setPerfil(e.target.value)}
                                name="textformat"
                                id="perfil"
                                variant="standard"
                                
                            />
                        </Grid>

                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Button variant="contained" size="small" color="primary" onClick={editarUsuario}>Actualizar</Button>
                                        </td>
                                        <td>
                                            <Button variant="contained" size="small" color="primary" onClick={cancelar}>Cancelar</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Grid>
                    </Grid>
                </Box >

            </Paper>
        </div>
    )

}

export default EditaUsuario