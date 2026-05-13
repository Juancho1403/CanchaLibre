import { API_BASE, USE_LOCAL_STORAGE } from "./api";

export async function createStripeCheckoutSession({ amountUsd, canchaId }) {
  if (USE_LOCAL_STORAGE) {
    throw new Error(
      "Modo demo local: no uses VITE_USE_LOCAL_STORAGE=true si querés pagar con Stripe (API real)."
    );
  }
  const res = await fetch(`${API_BASE}/payments/stripe/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountUsd, canchaId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Stripe no disponible");
  return data;
}

export async function createPayPalOrder({ amountUsd, canchaId }) {
  if (USE_LOCAL_STORAGE) {
    throw new Error(
      "Modo demo local: quitá VITE_USE_LOCAL_STORAGE=true y levantá la API para PayPal."
    );
  }
  const res = await fetch(`${API_BASE}/payments/paypal/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountUsd, canchaId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "PayPal no disponible");
  return data;
}

export async function createMercadoPagoPreference({ unit_price, title, currency_id }) {
  if (USE_LOCAL_STORAGE) {
    throw new Error(
      "Modo demo local: quitá VITE_USE_LOCAL_STORAGE=true y levantá la API para Mercado Pago."
    );
  }
  const res = await fetch(`${API_BASE}/mercadopago/create_preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ unit_price, title, currency_id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Mercado Pago no disponible");
  return data;
}
