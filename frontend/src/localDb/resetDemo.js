import { KEYS } from "./db";
import { ensureLocalSeed } from "./seedInitial";

/** Quita tablas de negocio en localStorage (mantiene usuarios y token por defecto). */
export function clearLocalBusinessData() {
  [KEYS.Empresas, KEYS.Canchas, KEYS.Reservas, KEYS.Mensajes, KEYS.Contactos].forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Vuelve a generar el demo en el navegador.
 * @param {{ clearUsers?: boolean }} options — si true, borra usuarios demo y el token (cerrás sesión).
 */
export function resetCanchaYaDemoData(options = {}) {
  const { clearUsers = false } = options;
  clearLocalBusinessData();
  if (clearUsers) {
    localStorage.removeItem(KEYS.Usuarios);
    localStorage.removeItem("token");
  }
  ensureLocalSeed();
}
