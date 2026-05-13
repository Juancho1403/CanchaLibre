import { apiFetch } from "./api";

export async function obtenerSocios() {
  return apiFetch("/usuario", { method: "GET" });
}

export async function obtenerSociosConId(id) {
  return apiFetch(`/usuario/${id}`, { method: "GET" });
}

export async function modifyUser(user) {
  return apiFetch(`/usuario/${user.id_usuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function deleteUser(user) {
  return apiFetch(`/usuario/${user.id_usuario}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function createUser(user) {
  return apiFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function obtenerEmpresas() {
  return apiFetch("/empresa", { method: "GET" });
}

export async function modifyEmpresa(empresa) {
  return apiFetch(`/empresa/${empresa.id_empresa}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa),
  });
}

export async function deleteEmpresa(empresa) {
  return apiFetch(`/empresa/${empresa.id_empresa}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa),
  });
}
