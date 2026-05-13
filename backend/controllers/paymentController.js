const {
  FRONTEND_URL,
  STRIPE_SECRET_KEY,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API_BASE,
} = require("../config/env");

const stripeClient = STRIPE_SECRET_KEY
  ? require("stripe")(STRIPE_SECRET_KEY)
  : null;

async function paypalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal no configurado (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)");
  }
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const base = PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.message || "PayPal token error");
  }
  return data.access_token;
}

const createStripeCheckout = async (req, res) => {
  try {
    if (!stripeClient) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe no configurado. Definí STRIPE_SECRET_KEY en backend/.env",
      });
    }
    const amountUsd = Math.min(Math.max(Number(req.body.amountUsd) || 0, 1), 500);
    const canchaId = req.body.canchaId || "";
    const base = FRONTEND_URL.replace(/\/$/, "");
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${base}/reserva/confirmacion?stripe=1&session_id={CHECKOUT_SESSION_ID}&canchaId=${encodeURIComponent(
        String(canchaId)
      )}`,
      cancel_url: `${base}/checkout?canceled=1${canchaId ? `&canchaId=${canchaId}` : ""}`,
      metadata: { canchaId: String(canchaId) },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amountUsd * 100),
            product_data: {
              name: "Reserva de cancha",
              description: canchaId ? `Cancha #${canchaId}` : "CanchaYa",
            },
          },
        },
      ],
    });
    return res.status(200).json({ success: true, url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

const createPayPalOrder = async (req, res) => {
  try {
    const amountUsd = Math.min(Math.max(Number(req.body.amountUsd) || 0, 1), 500);
    const canchaId = req.body.canchaId || "";
    const token = await paypalAccessToken();
    const base = PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amountUsd.toFixed(2),
            },
            description: canchaId ? `Reserva cancha #${canchaId}` : "Reserva cancha",
          },
        ],
        application_context: {
          return_url: `${FRONTEND_URL.replace(/\/$/, "")}/reserva/confirmacion?paypal=1&canchaId=${encodeURIComponent(
            String(canchaId)
          )}`,
          cancel_url: `${FRONTEND_URL.replace(/\/$/, "")}/checkout?canceled=1${
            canchaId ? `&canchaId=${canchaId}` : ""
          }`,
        },
      }),
    });
    const order = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(order.message || JSON.stringify(order));
    }
    const approve = (order.links || []).find((l) => l.rel === "approve")?.href;
    return res.status(200).json({ success: true, id: order.id, approveUrl: approve });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = { createStripeCheckout, createPayPalOrder };
