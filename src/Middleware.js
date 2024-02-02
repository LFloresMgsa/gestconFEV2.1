// middleware.js
const sensitiveActions = ['SET_TOKEN'];   // Actualizado a 'SET_TOKEN'

const hideSensitiveDataMiddleware = store => next => action => {
  if (sensitiveActions.includes(action.type)) {
    const sanitizedAction = { ...action };

    // Oculta los valores sensibles en acciones específicas
    if (action.type === 'SET_TOKEN') {
      sanitizedAction.payload = '*****'; // Puedes utilizar cualquier valor para ocultar
    }

    // Almacena el token en Redux cuando se guarda en localStorage
    if (action.type === 'SET_TOKEN') {
      store.dispatch(setToken(action.payload));
    }

    console.log('Dispatching:', sanitizedAction);
  } else {
    console.log('Dispatching:', action);
  }

  return next(action);
};

export default hideSensitiveDataMiddleware;
