import CryptoJS from 'crypto-js';

export const storage = {
  IniciaVariablesGlobales,
  SetStorage,
  GetStorage,
  GetStorageN,
  DelStorage,
  SetStorageObj,
  GetStorageObj
};


//const secretKey = GetStorage("Sgm_cUsuario") !== null || GetStorage("Sgm_cUsuario") == ""? GetStorage("Sgm_cUsuario")  : '';

const secretKey = GetStorage('aaa');
console.log(secretKey);

function IniciaVariablesGlobales() {
  return true;
}

function SetStorage(pVariable, pValue) {
  if (pValue !== undefined) {
    try {



      const encryptedValue = CryptoJS.AES.encrypt(pValue, secretKey).toString();
      //console.log('Encrypted Value:', encryptedValue);
      localStorage.setItem(pVariable, encryptedValue);
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

function SetStorageObj(pVariable, pValue) {
  const obj = JSON.stringify(pValue);
  try {
    
    const encryptedValue = CryptoJS.AES.encrypt(obj, secretKey).toString();
   //console.log('Encrypted Value:', encryptedValue);
    localStorage.setItem(pVariable, encryptedValue);
    return true;
  } catch (error) {
    console.error('Error durante el cifrado:', error);
    return false;
  }
}


function DelStorage(pVariable) {
  localStorage.removeItem(pVariable);
  return true;
}

function GetStorage(pVariable) {
  
  const encryptedValue = localStorage.getItem(pVariable) || "";

  

  if (encryptedValue === "") {
    return "";
  }

  try {

    // console.log('---3');

    // console.log('encryptedValue:', encryptedValue);
    // console.log('secretKey:', secretKey);

    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);

    // console.log('---4');

    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    //console.error('Error durante el descifrado pVariable:', pVariable);
    //console.error('Error durante el descifrado encryptedValue:', encryptedValue);
    
    return "";
  }
}


// function ClearStorage(pVariable, pValue) {
//   localStorage.setItem(pVariable, pValue); // Codificar en Base64
//   return true;
// }


function GetStorageN(pVariable) {
  const encryptedValue = localStorage.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return "";
  }

  try {
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedValue || "";
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return "";
  }
}

function GetStorageObj(pVariable) {
  const encryptedValue = localStorage.getItem(pVariable) || "";

  if (encryptedValue === "") {
    return [];
  }

  try {
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedValue) || [];
  } catch (error) {
    console.error('Error durante el descifrado:', error);
    return [];
  }
}


