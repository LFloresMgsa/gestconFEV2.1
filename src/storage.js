import CryptoJS from 'crypto-js';

export const storage = {
  IniciaVariablesGlobales,
  SetStorage,
  GetStorage,
  DelStorage,
  SetStorageObj,
  GetStorageObj,
  hideAccesoSubida,
  isAccesoSubidaHidden
};

function IniciaVariablesGlobales() {
  // Código de inicialización si es necesario
  return true;
}

function generarClaveAleatoria(longitud) {
  const caracteres = 'あいうえおかきくけこさしすせそたちつてと' +
                     'なにぬねのはひふへほまみむめもやゆよら' +
                     'りるれろわをん漢字汉字1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let clave = '';
  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    clave += caracteres.charAt(indice);
  }
  return clave;
}

const claveSecreta = generarClaveAleatoria(64); // Genera una clave de 64 caracteres

function SetStorage(pVariable, pValue) {
  if (pValue !== undefined) {
    try {
      const encryptedValue = cifrarConClave(pValue);
      sessionStorage.setItem(pVariable, encryptedValue);
      return true;
    } catch (error) {
      console.error('Error durante el cifrado:', error);
      return false;
    }
  } else {
    console.error('pValue es indefinido');
    return false;
  }
}

function GetStorage(pVariable) {
  try {
    const encryptedValue = sessionStorage.getItem(pVariable) || "";
    if (encryptedValue === "") {
      return "";
    }
    const decryptedValue = descifrarConClave(encryptedValue);
    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return "";
  }
}

function cifrarConClave(valor) {
  // Primero, ciframos en base64
  const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(valor));
  // Luego, mezclamos con caracteres japoneses, chinos y números
  let encryptedValue = '';
  for (let i = 0; i < base64.length; i++) {
    encryptedValue += base64.charAt(i) + generarClaveAleatoria(1); // Mezclamos con caracteres japoneses, chinos y números
  }
  return encryptedValue;
}

function descifrarConClave(encryptedValue) {
  let base64 = '';
  // Deshacemos la mezcla, extrayendo solo los caracteres base64
  for (let i = 0; i < encryptedValue.length; i++) {
    if (i % 2 === 0) {
      base64 += encryptedValue.charAt(i);
    }
  }
  // Desciframos el valor base64
  const decryptedValue = CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
  return decryptedValue;
}

function SetStorageObj(pVariable, pValue) {
  const obj = JSON.stringify(pValue);
  try {
    const encryptedValue = cifrarConClave(obj);
    sessionStorage.setItem(pVariable, encryptedValue);
    return true;
  } catch (error) {
    console.error('Error durante el cifrado:', error);
    return false;
  }
}

function DelStorage(pVariable) {
  sessionStorage.removeItem(pVariable);
  return true;
}

function GetStorageObj(pVariable) {
  const encryptedValue = sessionStorage.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return [];
  }

  try {
    const decryptedValue = descifrarConClave(encryptedValue);
    return JSON.parse(decryptedValue) || [];
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return [];
  }
}

function hideAccesoSubida() {
  storage.Sgm_cAccesodeSubidaHidden = true;
}

function isAccesoSubidaHidden() {
  return storage.Sgm_cAccesodeSubidaHidden === true;
}
