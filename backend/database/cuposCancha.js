const Reserva = require("../models/reserva");

const HORAS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

/**
 * Crea filas de reserva "disponible" para los próximos 7 días y franjas estándar.
 * No aplica patrón demo de ocupación.
 */
async function crearCuposDisponiblesParaCanchaIds(canchaIds) {
  if (!canchaIds?.length) return;
  const hoy = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const fecha = d.toISOString().slice(0, 10);
    for (const id_cancha of canchaIds) {
      for (const horario of HORAS) {
        const existe = await Reserva.findOne({ where: { id_cancha, fecha, horario } });
        if (!existe) {
          await Reserva.create({
            fecha,
            horario,
            estado: "disponible",
            id_cancha,
          });
        }
      }
    }
  }
}

module.exports = { HORAS, crearCuposDisponiblesParaCanchaIds };
