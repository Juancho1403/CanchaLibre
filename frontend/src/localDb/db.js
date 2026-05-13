/** Nombres alineados a las tablas SQLite del proyecto */
export const KEYS = {
  Usuarios: "CanchaYa_Usuarios",
  Empresas: "CanchaYa_Empresas",
  Canchas: "CanchaYa_Canchas",
  Reservas: "CanchaYa_Reservas",
  Mensajes: "CanchaYa_Mensajes",
  Contactos: "CanchaYa_Contactos",
  PartidosAbiertos: "CanchaYa_PartidosAbiertos",
  PartidosParticipantes: "CanchaYa_PartidosParticipantes",
};

export function readTable(name) {
  const key = KEYS[name];
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function writeTable(name, rows) {
  const key = KEYS[name];
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(rows));
}

export function nextId(rows, idField) {
  if (!rows.length) return 1;
  return Math.max(...rows.map((r) => Number(r[idField]) || 0)) + 1;
}
