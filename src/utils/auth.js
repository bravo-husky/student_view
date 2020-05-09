export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token, role) {
  localStorage.setItem("token", JSON.stringify(token));
  localStorage.setItem("role", JSON.stringify(role));
}

export function setHeaders(studentid) {
  localStorage.setItem("studentid", JSON.stringify(studentid));
}

export function getHeaders() {
  return localStorage.getItem("studentid");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function isLogined() {
  if (localStorage.getItem("token")) {
    return true;
  }
  return false;
}

export function getUser() {
  return localStorage.getItem("role");
}
