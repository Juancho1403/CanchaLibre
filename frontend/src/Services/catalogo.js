import { apiFetch } from "./api";

export function fetchCatalogoCanchas(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") search.set(k, v);
  });
  const q = search.toString();
  return apiFetch(`/catalogo/canchas${q ? `?${q}` : ""}`);
}

export function fetchCatalogoCancha(id) {
  return apiFetch(`/catalogo/canchas/${id}`);
}
