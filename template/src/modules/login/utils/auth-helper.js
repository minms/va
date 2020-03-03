export function getToken() {
  return localStorage.getItem('auth.token') || null;
}

export function setToken(token) {
  if (token == null) {
    return localStorage.removeItem('auth.token')
  }
  return localStorage.setItem('auth.token', token);
}