//evento.service.js
import { authHeader, handleResponse } from '../helpers';
import Fetch from '../helpers/Fetch';
import axios from 'axios';

export const eventoService = {
  obtenerUsuario,
  obtenerUsuariov2,
  obtenerToken,
  obtenerFilesv2,
  obtenerDirectorios,
  cargarArchivo
};

function obtenerToken(dataJson) {
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};

  const url = `/api/gescon/auth`;
  return Fetch.post(url, params, options).then((res) =>

  
    handleResponse(res, false)
  );
}

async function cargarArchivo(file, urlActual, filename) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('urlDestino', urlActual);
    formData.append('filename', filename);

    console.log('FormData:', Object.fromEntries(formData.entries()));

    const url = '/api/gescon/cargararchivo';
    console.log('URL de carga de archivo:', url);

    const response = await Fetch.postFile(url, formData);

    if (!response.ok) {
      console.error('Error en la respuesta:', response.status, response.statusText);
      const text = await response.text();
      console.error('Cuerpo de la respuesta:', text);
      throw new Error('Error en la respuesta del servidor');
    }

    return handleResponse(response, false);

  } catch (error) {
    console.error('Error en la función cargarArchivo:', error);
    throw error;
  }
}



// function cargarArchivo(file, category) {
//   try {
//     const options = { headers: authHeader() };

//     // Agrega los parámetros directamente en la URL
//     const url = `/api/gescon/cargararchivo?file=${encodeURIComponent(file)}&category=${encodeURIComponent(category)}`;
//     console.log('URL de carga de archivo:', url);

//     return Fetch.post(url, null, options).then((res) =>
//       handleResponse(res, false)
//     );
//   } catch (error) {
//     console.error('Error en la solicitud de carga de archivo:', error);
//     throw error;
//   }
// }

function obtenerDirectorios() {


  const options = { headers: authHeader()};
  const params = {};



  const url = `/api/gescon/directorios`;
  return Fetch.get(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}

function obtenerUsuario(dataJson) {
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};

//console.log(dataJson);

  const url = `/api/gescon/sgm_usuarios/auth`;
  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}

function obtenerUsuariov2(dataJson) {
  const options = { headers: authHeader(), body: JSON.stringify(dataJson) };
  const params = {};

//console.log(dataJson);

  const url = `/api/gescon/sgm_usuarios`;
  return Fetch.post(url, params, options).then((res) =>
    handleResponse(res, false)
  );
}


function obtenerFilesv2(category) {
  try {
    const options = { headers: authHeader() };
    const params = {};
    const encodedCategory = encodeURIComponent(category)
    // Utiliza Fetch.get para realizar una solicitud GET
    const url = `/api/gescon/documentos?category=${encodedCategory}`;

    //console.log(url);
    //console.log(category);

    return Fetch.post(url, params, options).then((res) =>
      handleResponse(res, false)
    );
  } catch (error) {
    console.error('Error en la solicitud:', error);
    // Puedes lanzar o devolver un objeto de error personalizado si es necesario.
    throw error;
  }
}