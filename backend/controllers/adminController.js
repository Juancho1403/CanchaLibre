const { Op } = require("sequelize");
const Reserva = require("../models/reserva");
const Cancha = require("../models/cancha");
const Empresa = require("../models/empresa");
const Usuario = require("../models/usuario");

function monthRangeStrings() {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const pad = (n) => String(n).padStart(2, "0");
  const startStr = `${y}-${pad(m + 1)}-01`;
  const lastDay = new Date(y, m + 1, 0).getDate();
  const endStr = `${y}-${pad(m + 1)}-${pad(lastDay)}`;
  return { startStr, endStr };
}

async function resumen(req, res) {
  try {
    const { startStr, endStr } = monthRangeStrings();

    const reservasMes = await Reserva.findAll({
      where: {
        fecha: { [Op.between]: [startStr, endStr] },
        estado: { [Op.in]: ["reservado", "confirmado"] },
      },
      include: [{ model: Cancha, attributes: ["precio", "nombre", "id_cancha"], include: [{ model: Empresa, attributes: ["nombre"] }] }, { model: Usuario, attributes: ["nombre", "email"] }],
    });

    const horasReservadas = reservasMes.length;
    let ingresosEstimados = 0;
    for (const r of reservasMes) {
      ingresosEstimados += Number(r.Cancha?.precio || 0);
    }

    const pendientes = await Reserva.count({ where: { estado: "reservado" } });

    const cola = await Reserva.findAll({
      where: { estado: "reservado" },
      limit: 12,
      order: [["id_reserva", "DESC"]],
      include: [
        { model: Usuario, attributes: ["nombre", "email"] },
        {
          model: Cancha,
          attributes: ["nombre", "precio"],
          include: [{ model: Empresa, attributes: ["nombre"] }],
        },
      ],
    });

    const colaPagos = cola.map((r) => ({
      id: r.id_reserva,
      name: r.Usuario?.nombre || "Socio",
      ref: String(r.id_reserva).padStart(4, "0"),
      amount: Number(r.Cancha?.precio || 0),
      status: "pending",
      fecha: r.fecha,
      horario: r.horario,
      cancha: r.Cancha?.nombre,
      empresa: r.Cancha?.Empresa?.nombre,
    }));

    res.json({
      success: true,
      ingresosEstimados,
      horasReservadas,
      validacionesPendientes: pendientes,
      reservasMesCount: reservasMes.length,
      colaPagos,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error al cargar resumen" });
  }
}

module.exports = { resumen };
