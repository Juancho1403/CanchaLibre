import { apiFetch } from "./api";

export async function enviarContacto(informacion) {
  return apiFetch("/contacto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(informacion),
  });
}
