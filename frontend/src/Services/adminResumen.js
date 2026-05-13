import { apiFetch } from "./api";

export function fetchAdminResumen() {
  return apiFetch("/admin/resumen", { method: "GET" });
}
