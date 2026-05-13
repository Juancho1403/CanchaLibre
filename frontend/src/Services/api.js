// Centralizar la URL base de la API (configurable con VITE_API_URL)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:3001/api";

/**
 * Modo demo offline (localStorage). Solo si VITE_USE_LOCAL_STORAGE=true.
 * Por defecto: API real (reservas y pagos contra el backend).
 */
export const USE_LOCAL_STORAGE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_USE_LOCAL_STORAGE === "true";

export async function apiFetch(endpoint, options = {}) {
  if (USE_LOCAL_STORAGE) {
    const { handleLocalApi } = await import("../localDb/localApi.js");
    try {
      return await handleLocalApi(endpoint, options);
    } catch (e) {
      throw new Error(e.message || "Error en modo local");
    }
  }

  const url = `${API_BASE}${endpoint}`;

  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(options.headers && typeof options.headers === "object" ? options.headers : {}),
  };
  if (token && !mergedHeaders.Authorization && !mergedHeaders.authorization) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: mergedHeaders,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || `Error ${response.status}`);
  }

  return data;
}

export { API_BASE };
