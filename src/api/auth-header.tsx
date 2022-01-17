export default function authHeader() {
  const user = localStorage.getItem('user');
    //const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    const token = JSON.parse(user).JWTToken
    return { 'Authorization': 'Bearer ' + token };
  // } else {
  //   return { };
  }
}

