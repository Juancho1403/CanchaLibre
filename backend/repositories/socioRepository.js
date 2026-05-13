const { Op } = require("sequelize");
const reserva = require("../models/reserva");
const cancha = require("../models/cancha");
const empresa = require("../models/empresa");
const usuario = require("../models/usuario");
const Mensaje = require("../models/mensaje");

// Helper para obtener fecha actual en UTC-3
function obtenerFechaActual() {
  let fecha = new Date();
  const horaUTC = fecha.getUTCHours();
  fecha.setUTCHours(horaUTC - 3);
  return {
    fechaHoy: fecha.toISOString().slice(0, 10),
    fechaConFormato: fecha.toISOString().slice(0, 19)
  };
}

// Reservar una cancha en un horario específico
const reservaCancha = async (id_usuario, id_cancha, fecha, horario) => {
  if (!id_usuario || !id_cancha || !fecha || !horario) {
    throw new Error("Todos los campos son obligatorios");
  }

  // Verificar si ya tiene una reserva en ese horario
  const reservaUsuario = await reserva.findOne({
    where: {
      estado: "reservado",
      id_usuario,
      fecha,
      horario,
    }
  });

  if (reservaUsuario) {
    throw new Error('Ya tiene una reserva en ese horario');
  }

  const findReserva = await reserva.update(
    { id_usuario, estado: "reservado" },
    {
      where: {
        id_cancha,
        fecha: fecha,
        estado: "disponible",
        horario,
      },
    }
  );

  // Buscar la empresa del usuario propietario
  const usuarioPropietario = await cancha
    .findByPk(id_cancha, {
      include: {
        model: empresa,
        attributes: ["id_usuario"],
      },
    })
    .then((data) => {
      return data.Empresa.id_usuario;
    });

  // Buscar el correo del propietario
  const correo = await usuario.findByPk(usuarioPropietario, {}).then((data) => {
    return data.email;
  });

  // Buscar el nombre de la cancha
  const nombreCancha = await cancha.findByPk(id_cancha, {
    attributes: ["nombre"],
  }).then((data) => {
    return data.nombre;
  });

  try {
    const { fechaConFormato } = obtenerFechaActual();

    // Crear mensaje para el socio
    const mensajeSocio = `Se ha hecho una reserva en la cancha "${nombreCancha}" a las ${horario} para la fecha: ${fecha}`;
    await Mensaje.create({
      id_usuario: id_usuario,
      fecha: fechaConFormato,
      tipo: 'positivo',
      nombre: mensajeSocio,
    });

    // Crear mensaje para el propietario
    const mensajePropietario = `Se ha hecho una reserva en la cancha "${nombreCancha}" a las ${horario} para la fecha: ${fecha}`;
    await Mensaje.create({
      id_usuario: usuarioPropietario,
      fecha: fechaConFormato,
      tipo: 'positivo',
      nombre: mensajePropietario,
    });

    return { findReserva, correo };
  } catch (error) {
    console.log(error);
    throw new Error(`Error al crear la reserva: ${error.message}`);
  }
};

// Visualizar reservas del usuario
const verReservas = async (id_usuario) => {
  try {
    const reservadas = await reserva.findAll({
      where: {
        id_usuario: id_usuario,
      },
      include: {
        model: cancha,
        attributes: ['nombre'],
        group: ['reserva.id_cancha'],
      },
      raw: true
    });

    return reservadas;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al obtener reservas: ${error.message}`);
  }
};

// Eliminar una reserva
const eliminarReserva = async (id_usuario, id_cancha, id_reserva) => {
  const findUser = await usuario.findByPk(id_usuario);

  if (!findUser) {
    throw new Error("El usuario no existe");
  }

  try {
    // Guardar el registro de la reserva
    const laReserva = await reserva.findOne({
      where: {
        id_usuario,
        id_cancha,
        id_reserva,
      },
    });

    const reservas = await reserva.update(
      { estado: "disponible", id_usuario: null },
      {
        where: {
          id_usuario,
          id_cancha,
          id_reserva,
        },
      }
    );

    // Buscar el nombre de la cancha
    const nombreCancha = await cancha.findByPk(id_cancha, {
      attributes: ["nombre"],
    }).then((data) => {
      return data.nombre;
    });

    const { fechaConFormato } = obtenerFechaActual();

    // Crear mensaje para el socio
    const mensajeSocio = `Se ha eliminado una reserva en su cancha "${nombreCancha}" a las ${laReserva.horario} para la fecha: ${laReserva.fecha}`;
    await Mensaje.create({
      id_usuario: id_usuario,
      fecha: fechaConFormato,
      tipo: 'negativo',
      nombre: mensajeSocio,
    });

    // Buscar el propietario de la cancha
    const id_propietario = await cancha.findByPk(id_cancha, {
      include: {
        model: empresa,
        attributes: ["id_usuario"],
      },
    }).then((data) => {
      return data.Empresa.id_usuario;
    });

    // Crear mensaje para el propietario
    const mensajePropietario = `Se ha eliminado una reserva en su cancha "${nombreCancha}" a las ${laReserva.horario} para la fecha: ${laReserva.fecha}`;
    await Mensaje.create({
      id_usuario: id_propietario,
      fecha: fechaConFormato,
      tipo: 'negativo',
      nombre: mensajePropietario,
    });

    return reservas;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al eliminar la reserva: ${error.message}`);
  }
};

const FRANJAS_ALQUILER = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

const calendarioPorEmpresa = async (id_empresa, fecha) => {
  const list = await cancha.findAll({
    where: { id_empresa },
    attributes: [
      "id_cancha",
      "nombre",
      "precio",
      "imagen_url",
      "hora_inicio",
      "hora_fin",
      "jugadores_min",
      "jugadores_max",
    ],
    order: [["id_cancha", "ASC"]],
  });
  const ids = list.map((c) => c.id_cancha);
  if (!ids.length) {
    return { fecha, franjas: FRANJAS_ALQUILER, canchas: [], celdas: [] };
  }
  const rows = await reserva.findAll({
    where: { fecha, id_cancha: { [Op.in]: ids } },
    order: [
      ["horario", "ASC"],
      ["id_cancha", "ASC"],
    ],
  });
  return {
    fecha,
    franjas: FRANJAS_ALQUILER,
    canchas: list,
    celdas: rows.map((r) => ({
      id_reserva: r.id_reserva,
      id_cancha: r.id_cancha,
      horario: r.horario,
      estado: r.estado,
    })),
  };
};

// Visualizar reserva por fecha
const verReservasFecha = async (id_cancha, fecha) => {
  try {
    const reservadas = await reserva.findAll({
      where: {
        id_cancha: id_cancha,
        fecha: fecha,
        estado: "disponible",
      },
      order: [["horario", "ASC"]],
    });

    return reservadas;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al obtener reservas: ${error.message}`);
  }
};

module.exports = {
  reservaCancha,
  verReservas,
  eliminarReserva,
  verReservasFecha,
  calendarioPorEmpresa,
};
