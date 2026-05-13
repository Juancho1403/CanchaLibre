import { apiFetch } from "./api";

export async function registerEmpresa(empresa) {
  return apiFetch("/empresa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empresa),
  });
}

export async function obtenerEmpresas() {
  return apiFetch("/empresa", { method: "GET" });
}
