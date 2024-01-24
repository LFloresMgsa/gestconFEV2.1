import Cookies from 'universal-cookie';

const cookies = new Cookies();


export function authHeader(isMultiPart, newToken) {


  try {
    const Token = cookies.get('token');
/*

    console.log('----------------------');
    console.log(Token);
    console.log('----------------------');
*/
    if (Token) {

      return {
        'Content-type': 'application/json',
        'x-auth-token': `${Token}`,
      };
    } else {
      return {
        'Content-type': 'application/json',
        'x-auth-token': 'error',
      };
    }
  } catch (error) {
    return {
      'Content-type': 'application/json',
      'x-auth-token': 'error',
    };
  }


}