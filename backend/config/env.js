const dotenv = require("dotenv");

dotenv.config();

const dbDialect = (process.env.DB_DIALECT || "sqlite").toLowerCase();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 3001,
  DB_DIALECT: dbDialect,
  /** Solo SQLite: ruta al archivo .sqlite (relativa al cwd del proceso, usualmente carpeta `backend/`) */
  DB_STORAGE: process.env.DB_STORAGE || "./database.sqlite",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "canchaya",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  TOKEN_KEY: process.env.TOKEN_KEY || "asd13579",
  EXPIRES: process.env.EXPIRES || "24h",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  /** Token de acceso (Checkout Pro / API). Es secreto; no lo subas al frontend. */
  MERCADOPAGO_KEY: process.env.MERCADOPAGO_KEY || "",
  /** Public Key (pk-test-… / APP_USR…-prod) solo si usás el SDK de MP en el navegador. */
  MERCADOPAGO_PUBLIC_KEY: process.env.MERCADOPAGO_PUBLIC_KEY || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  PAYPAL_API_BASE:
    process.env.PAYPAL_API_BASE ||
    (process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com"),
  CORREO: process.env.CORREO || "",
  MAILPASS: process.env.MAILPASS || "",
};
