const { Op } = require("sequelize");
const Cancha = require("../models/cancha");
const Empresa = require("../models/empresa");
const Reserva = require("../models/reserva");

async function listarCatalogo({ zona, precioMax, precioMin, q, fecha, franja, jugadores }) {
  const whereCancha = { tipo: "futbol" };
  const whereEmpresa = {};

  if (precioMax || precioMin) {
    whereCancha.precio = {};
    if (precioMin) whereCancha.precio[Op.gte] = Number(precioMin);
    if (precioMax) whereCancha.precio[Op.lte] = Number(precioMax);
  }

  const jn = parseInt(String(jugadores ?? ""), 10);
  if (!Number.isNaN(jn) && jn > 0) {
    whereCancha.jugadores_min = { [Op.lte]: jn };
    whereCancha.jugadores_max = { [Op.gte]: jn };
  }

  if (q) {
    const like = `%${q}%`;
    whereCancha[Op.or] = [
      { nombre: { [Op.like]: like } },
      { descripcion: { [Op.like]: like } },
    ];
  }

  if (zona) {
    const z = `%${zona}%`;
    whereEmpresa[Op.or] = [
      { zona: { [Op.like]: z } },
      { direccion: { [Op.like]: z } },
      { nombre: { [Op.like]: z } },
    ];
  }

  if (fecha) {
    const whereR = { fecha, estado: "disponible" };
    if (franja) whereR.horario = franja;
    const libres = await Reserva.findAll({
      where: whereR,
      attributes: ["id_cancha"],
      raw: true,
    });
    const ids = [...new Set(libres.map((r) => r.id_cancha))];
    if (ids.length === 0) return [];
    whereCancha.id_cancha = { [Op.in]: ids };
  }

  return Cancha.findAll({
    where: whereCancha,
    include: [
      {
        model: Empresa,
        required: true,
        where: Object.keys(whereEmpresa).length ? whereEmpresa : undefined,
        attributes: [
          "id_empresa",
          "nombre",
          "direccion",
          "telefono",
          "imagen",
          "zona",
          "servicios",
          "metodos_pago",
        ],
      },
    ],
    order: [["precio", "ASC"]],
  });
}

async function detalleCatalogo(id_cancha) {
  const row = await Cancha.findByPk(id_cancha, {
    include: [
      {
        model: Empresa,
        required: true,
        attributes: [
          "id_empresa",
          "nombre",
          "direccion",
          "telefono",
          "imagen",
          "zona",
          "servicios",
          "metodos_pago",
        ],
      },
    ],
  });
  if (!row || row.tipo !== "futbol") return null;
  return row;
}

module.exports = { listarCatalogo, detalleCatalogo };
