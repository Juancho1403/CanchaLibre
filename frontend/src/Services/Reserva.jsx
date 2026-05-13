import { apiFetch } from "./api";

export async function obtenerReservas() {
  return apiFetch("/reserva/todas/id_empresa", { method: "GET" });
}
