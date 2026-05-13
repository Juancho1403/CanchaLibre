import axios from "axios";
import { API_BASE, USE_LOCAL_STORAGE } from "./api";

export async function fetchMercadoPago() {
  if (USE_LOCAL_STORAGE) {
    throw new Error(
      "Modo demo local: quitá VITE_USE_LOCAL_STORAGE=true y usá la API para Mercado Pago."
    );
  }
  const { data } = await axios.post(`${API_BASE}/mercadopago/create_preference`);
  const url = data?.response?.body?.sandbox_init_point || data?.init_point;
  if (url) window.location.href = url;
}
