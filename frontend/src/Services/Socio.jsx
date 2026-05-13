import { apiFetch } from "./api";

export async function ReservarCancha(Cancha) {
  return apiFetch("/socio/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Cancha),
  });
}

export async function obtenerEmpresas() {
  return apiFetch("/empresa", { method: "GET" });
}

export async function obtenerCanchas(id_empresa) {
  return apiFetch(`/empresa/canchas/${id_empresa}`, { method: "GET" });
}

export async function ObtenerReservas(id_usuario) {
  return apiFetch(`/socio/misreservas/${id_usuario}`, { method: "GET" });
}

export async function eliminarReservas(id_usuario, id_cancha, id_reserva) {
  return apiFetch(`/socio/misreservas/eliminar/${id_usuario}/${id_cancha}/${id_reserva}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
}

export async function notificacionesSocio(id_usuario) {
  return apiFetch(`/mensaje/mensajes/${id_usuario}`, { method: "GET" });
}
