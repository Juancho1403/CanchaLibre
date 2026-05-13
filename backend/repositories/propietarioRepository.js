const usuario = require('../models/usuario');
const reserva = require('../models/reserva');
const cancha = require('../models/cancha');
const empresa = require('../models/empresa');
const Mensaje = require('../models/mensaje');

// Helper para obtener fecha actual en UTC-3
function obtenerFechaActual() {
  let fecha = new Date();
  const horaUTC = fecha.getUTCHours();
  fecha.setUTCHours(horaUTC - 3);
  return {
    fechaConFormato: fecha.toISOString().slice(0, 19)
  };
}

// Visualizar solo las reservas en estado pendiente
const listarReservasPendientes = async (id_propietario) => {
  const idEmpresa = await empresa.findOne({
    where: {
      id_usuario: id_propietario
    }
  }).then(data => {
    return data.id_empresa;
  });

  const reservas = await cancha.findAll({
    where: {
      id_empresa: idEmpresa,
    },
    include: [{
      model: reserva,
      where: {
        estado: 'reservado'
      }
    }]
  });

  return reservas;
};

// Confirmar una reserva
const confirmarReserva = async (id_reserva) => {
  const reservaData = await reserva.findByPk(id_reserva);
  if (!reservaData) {
    throw new Error('Reserva no encontrada');
  }

  const id_usuario = reservaData.id_usuario;
  const id_cancha = reservaData.id_cancha;

  // Buscar el nombre de la cancha
  const nombreCancha = await cancha.findByPk(id_cancha, {
    attributes: ["nombre"],
  }).then((data) => {
    return data.nombre;
  });

  const { fechaConFormato } = obtenerFechaActual();

  const mensajeSocio = `Se ha confirmado la reserva en la cancha "${nombreCancha}"`;
  await Mensaje.create({
    id_usuario: id_usuario,
    fecha: fechaConFormato,
    tipo: 'informativo',
    nombre: mensajeSocio,
  });

  try {
    const reservaConfirmada = await reserva.update(
      { estado: 'confirmado' },
      { where: { id_reserva: id_reserva } }
    );
    return reservaConfirmada;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al confirmar reserva: ${error.message}`);
  }
};

// Cancelar una reserva
const cancelarReserva = async (id_reserva) => {
  try {
    const reservaCancelada = await reserva.update(
      { estado: 'disponible' },
      { where: { id_reserva: id_reserva } }
    );
    return reservaCancelada;
  } catch (error) {
    console.log(error);
    throw new Error(`Error al cancelar reserva: ${error.message}`);
  }
};

// Listar reservas confirmadas
const listarReservasConfirmadas = async (id) => {
  const reservas = await reserva.findAll({
    where: {
      id_cancha: id,
      estado: 'confirmado'
    }
  });
  return reservas;
};

// Visualizar empresa del propietario
const listarEmpresaPropietario = async (id_usuario) => {
  const mostrarEmpresa = await empresa.findOne({
    where: {
      id_usuario: id_usuario
    }
  });
  return mostrarEmpresa;
};

// Visualizar reservas pendientes por fecha
const verReservasPendienteFecha = async (id_cancha, fecha) => {
  try {
    const reservadas = await reserva.findAll({
      where: {
        id_cancha: id_cancha,
        fecha: fecha,
        estado: "reservado",
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
  listarReservasPendientes,
  confirmarReserva,
  cancelarReserva,
  listarReservasConfirmadas,
  listarEmpresaPropietario,
  verReservasPendienteFecha
};
