import { apiFetch } from "./api";

export async function reservasPendiente(id_propietario) {
  return apiFetch(`/propietario/reservasPendientes/${id_propietario}`, { method: "GET" });
}

export async function listarEmpresaPropietario(id_usuario) {
  return apiFetch(`/propietario/visualizarEmpresa/${id_usuario}`, { method: "GET" });
}

export async function confirmarReserva(id_reserva) {
  return apiFetch(`/propietario/confirmarReserva/${id_reserva}`, { method: "PUT" });
}

export async function cancelarReserva(id_reserva) {
  return apiFetch(`/propietario/cancelarReserva/${id_reserva}`, { method: "PUT" });
}

export async function reservasConfirmadas(id_cancha) {
  return apiFetch(`/propietario/reservasConfirmadas/${id_cancha}`, { method: "GET" });
}
