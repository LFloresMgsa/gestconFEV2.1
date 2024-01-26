import React, { useState, useEffect } from 'react';
import { eventoService } from '../services/evento.service';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import { Typography, Box, Paper, InputAdornment, TextField, Divider } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { styled, css } from '@mui/system';
import AppFooter from '../components/layout/AppFooter';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import fon from '../imagenes/buscar.png'
import {
  IconForXlsx,
  IconForImagenes,
  IconForOtherFile,
  IconForPptx,
  IconForVideo,
  IconForWinrar,
  IconForDocx,
  IconForZip,
  IconForMusic,
} from './export-iconos/IconComponents';

const apiHost = `${SERVICE_URL}`;

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

const useStyles = makeStyles({

  customDataGrid: {
    '& .MuiDataGrid-cell': {
      fontSize: '15px',  // Ajusta el tamaño de letra según tus necesidades
    },

  },
});

const LoadFiles = (props) => {
  const classes = useStyles();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [documentos, setDocumentos] = useState([]);
  const [hoveredDocument, setHoveredDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [urlActual, setUrlActual] = useState('');
  const [titulo, setTitulo] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {

    //---------------------------------
    // Obtén la cadena de consulta de la URL
    const queryString = window.location.search;

    // Parsea la cadena de consulta para obtener los parámetros
    const urlParams = new URLSearchParams(queryString);

    // Obtiene el valor del parámetro 'path'
    const pathValue = urlParams.get('path');

    setUrlActual(pathValue);

    const ultimoDirectorio = obtenerUltimoDirectorio(queryString);
    setTitulo(ultimoDirectorio.toUpperCase());
    //---------------------------------


    const category = String(pathValue);


    setSelectedCategory(category);

    function obtenerUltimoDirectorio(url) {
      // Obtener el valor del parámetro 'path' de la URL
      const queryParams = new URLSearchParams(url.split('?')[1]);
      const path = queryParams.get('path');

      // Separar el path en partes utilizando el carácter '\'
      const partesPath = path.split('\\');

      // Obtener el último valor del array resultante
      const ultimoDirectorio = partesPath.pop();

      return ultimoDirectorio;
    }

    const fetchDocumentosData = async () => {
      try {


        //console.log(category);


        const res = await eventoService.obtenerFilesv2(category);

        if (res && res.files && Array.isArray(res.files) && res.files.length > 0) {
          setDocumentos(res.files);
        } else {
          console.warn('La propiedad files no es un array válido:', res.files);
          setDocumentos([]);
        }
      } catch (error) {
        console.error('Error fetching documents:', error.message);
      }
    };

    if (category) {
      fetchDocumentosData();
    } else {
      setDocumentos([]);
    }
  }, [props.pCategory]);




  const handleDocumentClick = (document) => {
    const encodedCategory = encodeURIComponent(selectedCategory);
    const encodedDocument = encodeURIComponent(document);
    const documentUrl = apiHost + `/api/gescon/archivos?category=${encodedCategory}&document=${encodedDocument}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.open(documentUrl, '_system');
    } else {
      // Mostrar un modal con opciones personalizadas

      window.open(documentUrl, '_blank')
      //console.log(documentUrl);
    }
  };



  const handleFileChange = (event) => {
    // Aquí actualizamos el estado con el archivo seleccionado
    setSelectedFile(event.target.files[0]);
  };



  const handleFileUpload = async () => {



    try {
      if (!selectedFile) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha seleccionado ningún archivo.'
      });
        //console.error('No se ha seleccionado ningún archivo.');
        return;
      }

       const response = await eventoService.cargarArchivo(selectedFile, urlActual, selectedFile.name);

      
      if (response) {
        //console.log('Respuesta del servidor:', response);

        if (response.success) {
          console.log('Archivo cargado con éxito:', response.message);
          // Realiza acciones adicionales después de cargar el archivo si es necesario
        } else {
          console.error('Error al cargar el archivo:', response.message || 'Error desconocido');
          // Muestra el mensaje de error al usuario
          alert(response.message || 'Error desconocido');
        }
      } else {
        console.error('Respuesta del servidor no válida:', response);
      }
    } catch (error) {
      
      // console.error('Error selectedFile:',selectedFile);
      // console.error('Error selectedFileName:',selectedFile.name);
      // console.error('Error urlActual:',urlActual);
      // console.error('Error en la carga del archivo-:', error.message);

      // Muestra el mensaje de error al usuario
      alert(error.message || 'Error desconocido');
    }
  };



  const handleButtonClick = (item) => {
    handleDocumentClick(item.fileName);
  };

  const filteredDocumentos = documentos.filter((documento) =>
    documento.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocumentos = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const renderFileTypeIcon = (fileName) => {
    const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

    switch (fileExtension) {
      case 'pdf':
        return <PdfIcon style={{ fontSize: 30, color: 'darkred' }} />;
      case 'docx':
        // Agrega aquí el icono para archivos Word
        return <IconForDocx />; // Reemplaza esto con tu propio icono o componente
      case 'xlsx':
      case 'xls':
      case 'xlsm':
      case 'xml':
        return <IconForXlsx />;
      case 'pptx':
        return <IconForPptx />;
      case 'jpg':
      case 'png':
      case 'jpeg':
      case 'jpe':
      case 'bmp':
        return <IconForImagenes />;
      case 'mp4':
      case 'wmv':
        return <IconForVideo />;
      case 'zip':
        return <IconForZip />;
      case 'rar':
        return <IconForWinrar />;
      case 'mp3':
      case 'm4a':
      case 'wav':
        return <IconForMusic />;
      default:
        return <IconForOtherFile />;
    }
  };

  return (
    <div style={{ marginTop: '35px' }}>
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
        {/* Agrega el controlador de cambio a tu entrada de archivo */}
        <input type="file" onChange={handleFileChange} />

        {/* Agrega un botón para iniciar la carga del archivo */}
        <button onClick={handleFileUpload}>Subir Archivo</button>
        <Typography
          variant="h5"
          color="black"
          align="center"  // Centra el texto
          fontWeight="bold"  // Pone el texto en negrita
          gutterBottom
        >
          {titulo}
        </Typography>
        <Typography
          variant="h6"
          color="black"
          align="left"
          fontSize="16px"
          fontWeight="normal"  // Pone el texto en negrita
          gutterBottom
        >
          Directorio: {urlActual}
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
                <InputAdornment position="end" >
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
                <TableCell
                  align="center"
                  sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                >
                  Tipo
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                >
                  Nombre del Archivo
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                >
                  Fecha de Modificación
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                >
                  Tamaño del Archivo
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: 'darkred', color: 'white', fontWeight: 'bold' }}
                >
                  Visualización
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentDocumentos.map((item, idx) => (
                <TableRow key={`${idx}_${indexOfFirstItem + idx}`}>
                  <TableCell align="center">
                    {renderFileTypeIcon(item.fileName)}
                  </TableCell>
                  <TableCell align="left">{item.fileName}</TableCell>
                  <TableCell align="center">{item.lastModified}</TableCell>
                  <TableCell align="center">{item.fileSize}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      variant="contained"
                      size="small"
                      color="black"
                      onClick={() => handleButtonClick(item)}
                    >
                      <img src="../imagenes/buscar.png" alt="" width="23" height="25" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Agrega la paginación */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ marginRight: '10px', fontWeight: 'bold' }}>
            Página {currentPage} de {totalPages}
          </Typography>
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
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
            disabled={indexOfLastItem >= filteredDocumentos.length}
            onClick={() => setCurrentPage(currentPage + 1)}
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
      </Paper>
      {/* Nuevo código que quieres agregar */}
      <FooterRoot>
        <div></div>
        <Divider />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>Copyright© 2024 - Management Group S.A.</div>
          <div></div>
        </div>
      </FooterRoot>
      <AppFooter />
    </div>
  );
};

export { LoadFiles };