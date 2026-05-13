const Reserva = require('../models/reserva');

const listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.status(200).json(reservas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const crearReserva = async (req, res) => {
  const { fecha, horario, id_cancha } = req.body;
  try {
    const reserva = await Reserva.create({
      fecha,
      horario,
      id_cancha
    });
    res.status(201).json(reserva);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const mostrarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    res.status(200).json(reserva);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const actualizarReserva = async (req, res) => {
  const { id } = req.params;
  const { fecha, horario, id_cancha } = req.body;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    reserva.fecha = fecha;
    reserva.horario = horario;
    reserva.id_cancha = id_cancha;
    await reserva.save();
    res.status(200).json(reserva);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const eliminarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    await reserva.destroy();
    res.status(204).json({ message: 'Reserva eliminada' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  listarReservas,
  crearReserva,
  mostrarReserva,
  actualizarReserva,
  eliminarReserva
};
