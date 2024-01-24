import React, { useState, useEffect } from 'react';

import { eventoService } from '../../services/evento.service';
import md5 from 'md5'; // Importa la función md5 si aún no lo has hecho
import { storage } from "../../views/storage.js";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Divider, TextField, InputAdornment, Button } from '@mui/material';
import AppFooter from '../../components/layout/AppFooter.js';
import SearchIcon from '@mui/icons-material/Search';
import { styled, css } from '@mui/system';
import { makeStyles } from '@mui/styles';
import fondo from '../../imagenes/fondotodos.png'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const ListarUsuario = (props) => {

  const fondoStyle = {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${fondo})`, // Opacidad agregada con rgba
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    // Otras propiedades de estilo según tus necesidades
  };

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Cargar al inicio de la página
  useEffect(() => {
    listar();
  }, []);

  const togglePasswordVisibility = (index) => {
    setVisiblePasswords((prevVisiblePasswords) => ({
      ...prevVisiblePasswords,
      [index]: !prevVisiblePasswords[index],
    }));
  };

  const renderPasswordCell = (password, index) => {
    return (
      <TableCell align="center" style={{ textAlign: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {visiblePasswords[index] ? (
            password
          ) : (
            password.replace(/./g, '*')
          )}
          <Button
            style={{ color: 'gray', marginLeft: '15px', border: '1px solid darkred' }}  // Ajusta el margen y el color del borde según tus preferencias
            onClick={() => togglePasswordVisibility(index)}
          >
            {visiblePasswords[index] ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </Button>
        </span>
      </TableCell>
    );
  };

  // Procedimiento para CONSULTAR un catálogo con SP MySQL
  const listar = async () => {
    let _body = { Accion: "BUSCARTODOS" }
    return await eventoService.obtenerUsuariov2(_body).then(
      (res) => {
        setData(res[0]);
      },
      (error) => {
        console.log(error);

      }
    );
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.Sgm_cNombre.toLowerCase().includes(searchTerm.toLowerCase())
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



  return (
    <div style={{ ...fondoStyle, marginTop: '35px' }}>
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

        <Box>
          <Typography
            variant="h5"
            color="black"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            MANTENIMIENTO DE USUARIOS
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <TextField
              label="Buscar por Nombre"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: '#8b0000' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Usuario</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Nombre</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Contraseña</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Observaciones</TableCell>
                  <TableCell align="center"
                    sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                  >Perfil</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={item.Sgm_cUsuario}>
                    <TableCell align="center">{item.Sgm_cUsuario}</TableCell>
                    <TableCell align="center">{item.Sgm_cNombre}</TableCell>
                    <TableCell align="center">{renderPasswordCell(item.Sgm_cContrasena, index)}</TableCell>
                    <TableCell align="center">{item.Sgm_cObservaciones}</TableCell>
                    <TableCell align="center">{item.Sgm_cPerfil}</TableCell>
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

export default ListarUsuario;