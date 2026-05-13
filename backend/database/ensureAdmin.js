const Usuario = require("../models/usuario");

/**
 * Garantiza el usuario de panel: email "admin", password "admin", rol administrador.
 * Idempotente: si ya existe, no modifica la contraseña (evita sorpresas en producción).
 */
async function ensureBootstrapAdmin() {
  const [u, created] = await Usuario.findOrCreate({
    where: { email: "admin" },
    defaults: {
      nombre: "Administrador",
      password: "admin",
      rol: "administrador",
    },
  });
  if (created) {
    console.log('👤 Usuario de panel creado: email "admin" / password "admin"');
  }
  return u;
}

module.exports = { ensureBootstrapAdmin };
