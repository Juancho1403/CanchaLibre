const { Op } = require("sequelize");

const reserva = require("../models/reserva");
const cancha = require("../models/cancha");

/** Franjas de alquiler: 17:00 a 22:00 (5 PM – 10 PM). */
const HORAS_DISPONIBLES = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

async function asegurarCuposDia(fechaHoy) {
  const canchas = await cancha.findAll();
  for (const c of canchas) {
    await reserva.destroy({
      where: {
        fecha: fechaHoy,
        id_cancha: c.id_cancha,
        estado: "disponible",
        horario: { [Op.notIn]: HORAS_DISPONIBLES },
      },
    });

    for (const hora of HORAS_DISPONIBLES) {
      const existe = await reserva.findOne({
        where: {
          fecha: fechaHoy,
          id_cancha: c.id_cancha,
          horario: hora,
        },
      });
      if (!existe) {
        await reserva.create({
          fecha: fechaHoy,
          horario: hora,
          estado: "disponible",
          id_cancha: c.id_cancha,
        });
      }
    }
  }
}

const CargarHorarios = async () => {
  console.log("\n**********************************************");
  console.log("Cupos de alquiler 17:00–22:00 (próximos 7 días)");

  const fechaBase = new Date();

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(fechaBase);
    fecha.setDate(fechaBase.getDate() + i);
    const fechaHoy = fecha.toISOString().slice(0, 10);
    await asegurarCuposDia(fechaHoy);
    console.log(`Cupos verificados: ${fechaHoy}`);
  }
  console.log("**********************************************\n");
};

module.exports = {
  CargarHorarios,
};
