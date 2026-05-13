import { apiFetch } from "./api";

export async function fetchCalendarioEmpresa(idEmpresa, fecha) {
  return apiFetch(`/socio/calendario/${idEmpresa}/${fecha}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export async function CanchasDisponibles(id) {
  return apiFetch(`/cancha/disponibles/${id}`, { method: "GET" });
}

export async function CanchasDisponiblesFecha(id, fecha) {
  return apiFetch(`/socio/misreservas/${id}/${fecha}`, { method: "GET" });
}

export async function CanchasReservadasFecha(id, fecha) {
  return apiFetch(`/propietario/reservasPendientesFecha/${id}/${fecha}`, { method: "GET" });
}

export async function listarCanchas() {
  return apiFetch("/cancha", { method: "GET" });
}

export async function registerCancha(values) {
  return apiFetch("/cancha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function modifyCancha(values) {
  return apiFetch(`/cancha/${values.id_cancha}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function deleteCancha(values) {
  return apiFetch(`/cancha/${values.id_cancha}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

export async function obtenerCanchass() {
  return apiFetch("/cancha", { method: "GET" });
}
