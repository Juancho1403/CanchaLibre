import { apiFetch } from "./api";

export function fetchPartidosAbiertos() {
  return apiFetch("/comunidad/partidos", { method: "GET" });
}

export function crearPartidoAbierto(payload) {
  return apiFetch("/comunidad/partidos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function unirsePartidoAbierto(idPartido) {
  return apiFetch(`/comunidad/partidos/${idPartido}/unirse`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
