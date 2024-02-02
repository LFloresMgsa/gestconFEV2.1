// Redux.js
import { createStore } from 'redux';

// Acciones
export const SET_IS_LOGED = 'SET_IS_LOGED';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_PERFIL = 'SET_PERFIL';
export const SET_USUARIO = 'SET_USUARIO';
export const setPerfil = (perfil) => ({ type: 'SET_PERFIL', perfil });
export const setUsuario = (usuario) => ({ type: 'SET_USUARIO', usuario });

// Reductor
const initialState = {

  userInfo: {},
  token: '',
  userDetails: {},
  perfil: null,
  usuario: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
      case 'SET_PERFIL':
        return { ...state, currentUser: { ...state.currentUser, perfil: action.perfil } };
      case 'SET_USUARIO':
        return { ...state, currentUser: { ...state.currentUser, usuario: action.usuario } };
    default:
      return state;
  }
};


export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  payload: userInfo,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setUserDetails = (userDetails) => ({
  type: SET_USER_DETAILS,
  payload: userDetails,
});



// Crear la tienda
const store = createStore(rootReducer);

export default store;
