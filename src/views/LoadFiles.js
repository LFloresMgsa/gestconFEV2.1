import React, { useCallback, useState, useEffect } from 'react';
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
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import Swal from 'sweetalert2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import fon from '../imagenes/buscar.png'
import { storage } from "../storage.js";
import { SHA256 } from 'crypto-js';
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
import LinearProgress from '@mui/material/LinearProgress';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const itemsPerPage = 10;
  const [data, setData] = useState([]);

  const [isLoged, setIsLoged] = useState(false);


  const [Sgm_cUrlActual, setUrl] = useState('')
  const [Sgm_cFilename, setFileName] = useState('')
  const [Sgm_cNombreUsuario, setNombreUsuario] = useState('')
  const [Sgm_cFechaMod, setFechaMod] = useState('')

  let _accesoSubida = '';
  let _validarUsuario = '';


  const obtenerArchivosTabla = async (Sgm_cTipo, Sgm_cUrlActual, Sgm_cFilename, Sgm_cNombreUsuario, Sgm_cTamanio) => {
    try {
      // Construir el objeto de datos para enviar al servicio
      const body = {
        Accion: "INSERTAR",
        Sgm_cTipo: Sgm_cTipo,
        Sgm_cUrlActual: Sgm_cUrlActual,
        Sgm_cFilename: Sgm_cFilename,
        Sgm_cNombreUsuario: Sgm_cNombreUsuario,
        Sgm_cTamanio: Sgm_cTamanio
      };

      // Llamar al servicio para insertar los datos
      const response = await eventoService.obtenerArchivosTabla(body);
      //console.log(response);
      // Manejar la respuesta adecuadamente
      if (response && !response.error) {
        //      console.log('Datos insertados correctamente:', response);
        return response; // Devolver los datos insertados
      } else {
        console.error('Error al insertar los datos:', response.error);
        return null; // Devolver null o lanzar una excepción según sea necesario
      }
    } catch (error) {
      console.error('Error en la función obtenerArchivosTabla:', error);
      throw error; // Lanzar el error para que pueda ser manejado en otro lugar si es necesario
    }
  };




  const onDrop = useCallback((acceptedFiles) => {
    // Actualiza el estado con los archivos seleccionados
    setSelectedFile(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: true, // Permite la carga de múltiples archivos
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar la ventana emergente
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Load de Pagina
  useEffect(() => {

    const _IsLoged = storage.GetStorage("IsLoged");
    setIsLoged(_IsLoged);
    //console.log('_IsLoged : ', _IsLoged);

  }, [])


  let _entro;

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
    //console.log(category);
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

    // const listarArchivos = async () => {
    //   let _body = { Accion: "LISTAR" };
    //   try {
    //     const res = await eventoService.obtenerArchivosTabla(_body);

    //     console.log("Respuesta de la API:", res);

    //     if (res && res[0]) {
    //       //  console.log(res[0]);
    //       setData(res[0]);
    //     } else {
    //       console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
    //     }
    //   } catch (error) {
    //     console.error("Error al obtener datos:", error);
    //   }
    // };



    fetchDocumentosData();

  }, [props.pCategory]);


  const fetchDocumentosData = async () => {

    //---------------------------------
    // Obtén la cadena de consulta de la URL
    const queryString = window.location.search;

    // Parsea la cadena de consulta para obtener los parámetros
    const urlParams = new URLSearchParams(queryString);

    // Obtiene el valor del parámetro 'path'
    const pathValue = urlParams.get('path');


    //"Sgm_cUrlActual":"contabilidad\\manuales",
    let _body = { Accion: "LISTAR", Sgm_cUrlActual: pathValue };

    console.log("pathValue: ", pathValue);
    try {
      const res = await eventoService.obtenerArchivosTabla(_body);

      //console.log("Respuesta de la API:", res);


      if (res && res[0]) {
        console.log(res[0]);

        _entro = true;

        setData(res[0]);
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

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


  const listarRestricciones = async () => {
    let _body = { Accion: "BUSCARRESTRIC" };
    try {
      const res = await eventoService.obtenerTabParametros(_body);

      if (res && Array.isArray(res[0]) && res[0].length > 0) {
        const restricciones = res[0].map(item => item.Sgm_cRestricciones.trim());
        return restricciones;
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
    }
  };

  const listaTamanio = async () => {
    let _body = { Accion: "BUSCARTAMANIO" };
    try {
      const res = await eventoService.obtenerTabParametros(_body);

      if (res && Array.isArray(res[0]) && res[0].length > 0) {
        const tamanioPermitidoString = res[0][0]?.Sgm_cRestricciones?.replace(/,/g, ''); // Elimina comas
        //console.log(tamanioPermitidoString);
        //console.log(Sgm_cRestricciones);
        const tamanioPermitido = parseInt(tamanioPermitidoString, 10);
        //console.log(tamanioPermitido);
        return tamanioPermitido;
      } else {
        console.error("Error: No se obtuvieron datos o los datos están en un formato incorrecto.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return null;
    }
  };


  const nombreUsuario = storage.GetStorage('Sgm_cNombre');

  const handleFileUpload = async () => {
    try {



      if (!selectedFile || selectedFile.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se ha seleccionado ningún archivo.'
        });
        return;
      }

      const restricciones = await listarRestricciones();
      const tamanioPermitido = await listaTamanio();

      if (!restricciones || restricciones.length === 0 || tamanioPermitido === null) {
        console.error('Error: No se obtuvieron restricciones o tamaño permitido.');
        return;
      }

      let successFlag = true;

      for (const file of selectedFile) {
        // Verificar si ya existe un archivo con el mismo nombre
        const existingFile = data.find((doc) => doc.fileName === file.name);

        if (existingFile) {
          successFlag = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ya existe un archivo con el mismo nombre.'
          });
          break;
        }
        if (file.size > tamanioPermitido) {
          successFlag = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El tamaño del archivo supera el límite permitido de 50mb.'
          });
          break;
        }

        //console.log(file.size);
        // Verificar si la extensión del archivo está en la lista de restricciones
        const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
        //console.log(fileExtension);
        if (restricciones.includes(`.${fileExtension}`)) {
          successFlag = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `La carga de archivos con extensión .${fileExtension} está restringida.`
          });
          break;
        }

        // Almacenar el nombre de usuario en el almacenamiento local después de iniciar sesión




        // const response = await eventoService.cargarArchivo(file, urlActual, file.name, nombreUsuario);
        const response = await eventoService.cargarArchivo(file, urlActual, file.name, nombreUsuario);

        //console.log(response);
        if (response && response.success) {
          successFlag = false;
          console.error(`Error al cargar el archivo ${file.name}:`, response.message || 'Error desconocido');
          break;
        }

        // Llamar a la función actualizaarchivo con los datos necesarios
        obtenerArchivosTabla(fileExtension, urlActual, selectedFile[0].name, nombreUsuario, file.size)


          .then((res) => {
            if (res) {
              setData(res);
              //console.log('Datos insertados correctamente:', res);
            } else {
              console.error('Error al insertar los datos');
            }
          })
          .catch((error) => {
            console.error('Error durante la inserción:', error);
            // Manejar cualquier error que ocurra durante la inserción
            setError(error.message || 'Error desconocido');
          });
        //  console.log(fileExtension);
        //  console.log(urlActual);
        //  console.log(selectedFile[0].name);
        //  console.log(nombreUsuario);

      }


      if (successFlag) {
        Swal.fire({
          icon: 'success',
          title: 'Todos los archivos cargados con éxito'
        }).then(() => {


          setIsModalOpen(false);
          fetchDocumentosData();
          //window.location.reload(); // Recargar la página 
        });
      }
    } catch (error) {
      console.error('Error durante la carga de archivos:', error.message || 'Error desconocido');
      alert(error.message || 'Error desconocido');
    }
  };


  const filteredData = Array.isArray(data) ? data.filter((documento) =>
  documento && documento.Sgm_cFilename && documento.Sgm_cFilename.toLowerCase().includes(searchTerm.toLowerCase())
) : [];

  const handleButtonClick = (item) => {
    handleDocumentClick(item.Sgm_cFilename);
  };




  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const currentDocumentos = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderFileTypeIcon = (fileName) => {
    if (!fileName) {
      return <IconForOtherFile />;
    }

    const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

    switch (fileExtension) {
      case 'pdf':
        return <PdfIcon style={{ fontSize: 30, color: 'darkred' }} />;
      case 'docx':
        return <IconForDocx />;
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


  const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
  };


  const parseISODate = (isoDate) => {
    const parts = isoDate.split(/[-T:.Z]/);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5], 0));
    return date;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
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
        {isLoged && (
          <Button
            variant="contained"
            onClick={() => {
              _accesoSubida = storage.GetStorage("Sgm_cAccesodeSubida");
              if (!_accesoSubida || _accesoSubida !== 'A') {
                Swal.fire({
                  icon: 'warning',
                  title: 'Advertencia',
                  text: 'Debes tener acceso para subir.'
                });
              } else {
                openModal();
              }
            }}
            style={{ marginLeft: 'auto', backgroundColor: 'darkred', marginBottom: '10px' }}
          >
            Subir Archivo
          </Button>
        )}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            zIndex: 1,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{
              backgroundColor: '#eeeeee',
              margin: '15% auto',
              padding: '50px',
              border: '1px solid #888',
              width: '60%',
              position: 'relative',
            }}>
              {/* Icono "X" en la esquina superior derecha */}
              <div style={{
                color: 'darkred',
                fontSize: '35px',
                fontWeight: 'bold',
                cursor: 'pointer',
                position: 'absolute',
                top: '10px',
                right: '30px',
              }} onClick={closeModal}>
                &times;
              </div>
              <Typography variant="h6" color="black" gutterBottom>
                Seleccione los archivos a cargar
              </Typography>
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Suelta los archivos aquí...</p>
                ) : (
                  <div>
                    {acceptedFiles.length > 0 ? (
                      <div>

                        <ul>
                          {acceptedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p style={{ fontSize: '70px', color: 'gray', opacity: '0.3' }}>+</p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'gray', width: '48%' }}
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: 'darkred', width: '48%' }}
                  onClick={handleFileUpload}
                >
                  Empezar a Cargar
                </Button>

              </div>
            </div>
          </div>
        )}

        <Typography
          variant="h5"
          color="black"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          {titulo}
        </Typography>
        <Typography
          variant="h6"
          color="black"
          align="left"
          fontSize="16px"
          fontWeight="normal"
          gutterBottom
        >
          Directorio: {urlActual}
        </Typography>

        {/* Agrega condición para el label "Buscar por Nombre" */}
        {!isModalOpen && (
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
        )}
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
                  Fecha de Creación
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
                  Propietario
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
                    {renderFileTypeIcon(item.Sgm_cFilename)}
                  </TableCell>
                  <TableCell align="left">{item.Sgm_cFilename}</TableCell>
                  <TableCell align="center">
                    {item.Sgm_cFechaMod ? parseISODate(item.Sgm_cFechaMod).toLocaleString() : 'Fecha inválida'}
                  </TableCell>
                  <TableCell align="center">{formatFileSize(item.Sgm_cTamanio)}</TableCell>
                  <TableCell align="center">{item.Sgm_cNombreUsuario}</TableCell>
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
            disabled={indexOfLastItem >= filteredData.length}
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