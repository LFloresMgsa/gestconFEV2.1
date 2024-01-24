import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { eventoService } from '../../services/evento.service';
import md5 from 'md5'; // Importa la función md5 si aún no lo has hecho
import { storage } from "../../views/storage.js";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ListarUsuario = (props) => {

  const history = useHistory();
  const [data, setData] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);

  // Cargar al inicio de la página
  useEffect(() => {
    listar();
  }, []);

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
        <Box>
          <table>
            <tbody>
              <tr>
                <td>
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="left">Usuario</StyledTableCell>
                          <StyledTableCell align="left">Nombre</StyledTableCell>
                          <StyledTableCell align="left">Contraseña</StyledTableCell>
                          <StyledTableCell align="left">Observaciones</StyledTableCell>
                          <StyledTableCell align="left">Perfil</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <StyledTableRow key={item.Sgm_cUsuario}>
                            <StyledTableCell align="left">{item.Sgm_cUsuario}</StyledTableCell>
                            <StyledTableCell align="left">{item.Sgm_cNombre}</StyledTableCell>
                            <StyledTableCell align="left">{item.Sgm_cContrasena}</StyledTableCell>
                            <StyledTableCell align="left">{item.Sgm_cObservaciones}</StyledTableCell>
                            <StyledTableCell align="left">{item.Sgm_cPerfil}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Paper>
    </div>
  );
};

export default ListarUsuario;
