const DEFAULT_METHODS = ["stripe", "paypal", "mercadopago", "pago_movil"];

export const PAYMENT_LABELS = {
  stripe: "Tarjeta (Stripe)",
  paypal: "PayPal",
  mercadopago: "Mercado Pago",
  pago_movil: "Reportar pago móvil / transferencia",
};

export function parseMetodosPago(empresa) {
  if (!empresa?.metodos_pago) return [...DEFAULT_METHODS];
  try {
    const v = JSON.parse(empresa.metodos_pago);
    if (Array.isArray(v) && v.length > 0) return v.map(String);
  } catch {
    /* ignore */
  }
  return [...DEFAULT_METHODS];
}

export function acceptsMethod(empresa, id) {
  return parseMetodosPago(empresa).includes(id);
}
