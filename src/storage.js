import CryptoJS from 'crypto-js';

export const storage = {
  IniciaVariablesGlobales,
  SetStorage,
  GetStorage,
  GetStorageN,
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

function SetStorage(pVariable, pValue) {
  if (pValue !== undefined) {
    try {
      // Cifrar el valor y almacenarlo en sessionStorage
      const encryptedValue = CryptoJS.AES.encrypt(pValue, pVariable).toString();
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
    // Obtener y descifrar el valor asociado con la clave
    const encryptedValue = sessionStorage.getItem(pVariable) || "";
    if (encryptedValue === "") {
      return "";
    }
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, pVariable).toString(CryptoJS.enc.Utf8);
    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return "";
  }
}

function SetStorageObj(pVariable, pValue) {
  const obj = JSON.stringify(pValue);
  try {
    // Encriptar usando AES y luego codificar en base64
    const encryptedValue = CryptoJS.AES.encrypt(obj, pVariable).toString();
    const base64Value = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedValue));

    // Almacenar en sessionStorage
    sessionStorage.setItem(pVariable, base64Value);
    return true;
  } catch (error) {
    console.error('Error durante el cifrado:', error);
    return false;
  }
}

function DelStorage(pVariable) {
  // Eliminar el elemento de sessionStorage
  sessionStorage.removeItem(pVariable);
  return true;
}

function GetStorageN(pVariable) {
  const encryptedValue = sessionStorage.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return "";
  }

  try {
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, pVariable).toString(CryptoJS.enc.Utf8);
    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return "";
  }
}

function GetStorageObj(pVariable) {
  const encryptedValue = sessionStorage.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return [];
  }

  try {
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, pVariable).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedValue) || [];
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return [];
  }
}

function hideAccesoSubida() {
  // No almacenamos la clave en el sessionStorage, solo establecemos el valor en memoria
  storage.Sgm_cAccesodeSubidaHidden = true;
}

function isAccesoSubidaHidden() {
  // Verificamos si el campo está "oculto" en memoria
  return storage.Sgm_cAccesodeSubidaHidden === true;
}
