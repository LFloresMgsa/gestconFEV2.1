import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { eventoService } from '../../services/evento.service';
import md5 from 'md5'; // Importa la función md5 si aún no lo has hecho
import { storage } from "../../storage.js";
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Box, Typography, Divider, TextField, InputAdornment,
    Button, CircularProgress
} from '@mui/material';
import AppFooter from '../../components/layout/AppFooter.js';
import SearchIcon from '@mui/icons-material/Search';
import { styled, css } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import fondo from '../../imagenes/fondotodos.png'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Swal from 'sweetalert2';
import { parseISO, format } from 'date-fns';

const listarArchivos = (props) => {

    const fondoStyle = {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${fondo})`, // Opacidad agregada con rgba
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        // Otras propiedades de estilo según tus necesidades
    };


    const history = useHistory();
    const [data, setData] = useState([]);
    const [searchTermRestriccion, setSearchTermRestriccion] = useState('');
    const [searchTermTipo, setSearchTermTipo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    // Estado para almacenar la cantidad de archivos por usuario y por tipo
    const [cantidadArchivosPorUsuario, setCantidadArchivosPorUsuario] = useState({});
    const [cantidadArchivosPorTipo, setCantidadArchivosPorTipo] = useState({});

    // Cargar al inicio de la página
    useEffect(() => {
        listar();
    }, []);


    const listar = async () => {
        let _body = { Accion: "BUSCARTODOS" };
        try {
            const res = await eventoService.obtenerArchivosTabla(_body);
            if (res && res[0]) {
                setData(res[0]);
                calcularCantidadArchivosPorUsuario(res[0]);
                calcularCantidadArchivosPorTipo(res[0]);
            } else {
                console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    const calcularCantidadArchivosPorUsuario = (data) => {
        const cantidadPorUsuario = {};
        data.forEach(item => {
            if (item.Sgm_cNombreUsuario in cantidadPorUsuario) {
                cantidadPorUsuario[item.Sgm_cNombreUsuario]++;
            } else {
                cantidadPorUsuario[item.Sgm_cNombreUsuario] = 1;
            }
        });
        setCantidadArchivosPorUsuario(cantidadPorUsuario);
    };

    const calcularCantidadArchivosPorTipo = (data) => {
        const cantidadPorTipo = {};
        data.forEach(item => {
            if (item.Sgm_cTipo in cantidadPorTipo) {
                cantidadPorTipo[item.Sgm_cTipo]++;
            } else {
                cantidadPorTipo[item.Sgm_cTipo] = 1;
            }
        });
        setCantidadArchivosPorTipo(cantidadPorTipo);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const filteredData = (data || []).filter((item) =>
        item?.Sgm_cUrlActual?.toLowerCase().includes(searchTermRestriccion.toLowerCase()) &&
        item?.Sgm_cNombreUsuario?.toLowerCase().includes(searchTermTipo.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);


    const FooterRoot = styled('footer')(
        ({ theme }) => css`
      margin: 0 auto;
      text-align: center;
      width: 32%;
      margin-top: 30px !important;
  
      & > div:nth-child(1) {
        position: relative;
        display: flex;
        justify-content: space-evenly;
        align-items: end;
        height: 40px;
      }
  
      small {
        color: #5e6c79;
      }
  
      & .MuiBox-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        -webkit-box-align: start;
        margin: 7px;
      }
  
      .MuiDivider-wrapperVertical {
        padding: 0px;
      }
  
      & > .MuiDivider-root:nth-child(2) {
        margin: 5px auto;
      }
  
      .MuiButton-textDefault {
        text-transform: capitalize;
        line-height: 10px;
      }
  
      .legal {
        display: flex;
        font-size: 0.6  rem;
        justify-content: space-between;
      }
    `
    );


    const limpiarcampos = () => {
        setSearchTermRestriccion('');
        setSearchTermTipo('');
    }

    // Función para formatear la fecha
    const formatDateTime = (dateString) => {
        const date = parseISO(dateString); // Convierte la cadena de fecha en un objeto Date
        return format(date, 'dd/MM/yyyy HH:mm:ss'); // Formatea la fecha y la hora
    };


    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    };

    function CircularProgressWithLabel({ value, color, cantidad }) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={value} sx={{ color }} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="textSecondary">{cantidad}</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <div style={{ ...fondoStyle, marginTop: '35px' }}>
            <Paper
                sx={{
                    p: 2,
                    margin: 1,
                    maxWidth: '100%',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        color="black"
                        align="center"
                        fontWeight="bold"
                        gutterBottom
                    >
                        MANTENIMIENTO DE ARCHIVOS
                    </Typography>


                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div>
                                <Typography variant="h6" color="textPrimary" style={{ fontWeight: 'bold' }} gutterBottom>
                                    Cantidad de archivos por usuario:
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {Object.entries(cantidadArchivosPorUsuario).map(([usuario, cantidad], index) => (
                                        <div key={usuario} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                            <Typography variant="body1" color="textPrimary" gutterBottom style={{ marginRight: '10px' }}>
                                                {usuario}
                                            </Typography>
                                            <CircularProgressWithLabel value={(cantidad / data.length) * 100} color={index % 2 === 0 ? 'blue' : 'green'} cantidad={cantidad} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
                            <div>
                                <Typography variant="h6" color="textPrimary" style={{ fontWeight: 'bold' }} gutterBottom>
                                    Cantidad de archivos por tipo:
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    {Object.entries(cantidadArchivosPorTipo).map(([tipo, cantidad], index) => (
                                        <div key={tipo} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                                            <Typography variant="body1" color="textPrimary" gutterBottom style={{ marginRight: '10px' }}>
                                                {tipo}
                                            </Typography>
                                            <CircularProgressWithLabel value={(cantidad / data.length) * 100} color={index % 2 === 0 ? 'orange' : 'purple'} cantidad={cantidad} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>



                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <TextField
                            label="Buscar por Url"
                            variant="outlined"
                            size="small"
                            value={searchTermRestriccion}
                            onChange={(e) => setSearchTermRestriccion(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon style={{ color: '#8b0000' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginRight: '20px' }}
                        />

                        <TextField
                            label="Buscar por Usuario"
                            variant="outlined"
                            size="small"
                            value={searchTermTipo}
                            onChange={(e) => setSearchTermTipo(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon style={{ color: '#8b0000' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={limpiarcampos}
                        style={{ marginLeft: 'auto', backgroundColor: 'darkred', marginBottom: '10px' }}
                    >
                        Limpiar Campos
                    </Button>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >UrlActual</TableCell>

                                    <TableCell align="left"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >Nombre del Archivo</TableCell>
                                    <TableCell align="center"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >Tamaño</TableCell>
                                    <TableCell align="left"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >Tipo</TableCell>

                                    <TableCell align="left"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >Fecha de Creaciòn</TableCell>

                                    <TableCell align="left"
                                        sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                                    >Usuario</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index}>

                                        <TableCell align="left">{item.Sgm_cUrlActual}</TableCell>

                                        <TableCell align="left">{item.Sgm_cFilename}</TableCell>
                                        <TableCell align="center">{formatFileSize(item.Sgm_cTamanio)}</TableCell>
                                        <TableCell align="left">{item.Sgm_cTipo}</TableCell>

                                        <TableCell align="center">
                                            {item.Sgm_cFechaMod ? formatDateTime(item.Sgm_cFechaMod) : 'Fecha inválida'}
                                        </TableCell>

                                        <TableCell align="left">{item.Sgm_cNombreUsuario}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ marginRight: '10px', fontWeight: 'bold' }}>
                            Página {currentPage} de {totalPages}
                        </Typography>
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            sx={{
                                marginRight: '5px',
                                color: 'black',
                                backgroundColor: '',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '',
                                },
                            }}
                        >
                            <NavigateBeforeIcon />
                        </Button>
                        <Button
                            disabled={indexOfLastItem >= filteredData.length}
                            onClick={() => handlePageChange(currentPage + 1)}
                            sx={{
                                marginRight: '5px',
                                color: 'black',
                                backgroundColor: '',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '',
                                },
                            }}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </Box>

                </Box>
            </Paper>
            <FooterRoot>
                <div></div>
                <Divider />
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>Copyright© 2024 - Management Group S.A.</div>
                    <div></div>
                </div>
            </FooterRoot>
            <AppFooter />
            <Divider />
        </div>
    );
};

export default listarArchivos;