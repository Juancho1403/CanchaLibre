const mercadopago = require("mercadopago");
const { FRONTEND_URL } = require("../config/env");

require("dotenv").config();

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_KEY,
});

function normalizeFrontendOrigin() {
  const raw = String(FRONTEND_URL || "http://localhost:5173").trim();
  const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
  return withProto.replace(/\/+$/, "");
}

const createPreference = async (req, res) => {
  try {
    const unit_price = Math.max(
      1,
      Number(Number(req.body?.unit_price ?? req.body?.amountUsd ?? 25).toFixed(2))
    );
    const title = String(req.body?.title || "Reserva CanchaYa").slice(0, 127);
    const currency_id = String(req.body?.currency_id || "USD").toUpperCase();

    const base = normalizeFrontendOrigin();
    const success = `${base}/reserva/confirmacion`;
    const failure = `${base}/checkout`;
    const pending = `${base}/checkout`;

    const preference = {
      items: [
        {
          title,
          unit_price,
          quantity: 1,
          currency_id,
        },
      ],
      back_urls: {
        success,
        failure,
        pending,
      },
      binary_mode: true,
    };

    // Con `auto_return`, MP exige `back_urls.success` válida; en http://localhost suele fallar.
    if (/^https:\/\//i.test(success)) {
      preference.auto_return = "approved";
    }

    const response = await mercadopago.preferences.create(preference);
    const body = response.body || response;
    return res.status(200).json({
      init_point: body.init_point,
      id: body.id,
    });
  } catch (error) {
    console.error("MercadoPago preference:", error);
    return res.status(400).json({
      message: error.message || "Error creando preferencia Mercado Pago",
    });
  }
};

module.exports = {
  createPreference,
};
