const canchaRepository = require("../repositories/canchaRepository");
const { crearCuposDisponiblesParaCanchaIds } = require("../database/cuposCancha");

const reserva = require("../models/reserva");

// Método para listar todas las canchas
const listarCanchas = async (req, res) => {
  try {
    const canchas = await canchaRepository.listarCanchas();

    res.status(200).json(canchas);
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

// Método para crear una nueva cancha
const crearCancha = async (req, res) => {
  try {
    const nueva = await canchaRepository.crearCancha(req.body);
    await crearCuposDisponiblesParaCanchaIds([nueva.id_cancha]);
    res.status(201).json(nueva);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Método para mostrar una cancha específica
const mostrarCancha = async (req, res) => {
  const { id } = req.params;
  try {
    const cancha = await canchaRepository.mostrarCancha(id);
    res.status(200).json(cancha);
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

// Método para actualizar una cancha existente
const actualizarCancha = async (req, res) => {
  const { id } = req.params;
  try {
    const actualizada = await canchaRepository.actualizarCancha(id, req.body);
    res.status(200).json(actualizada);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Método para eliminar una cancha existente
const eliminarCancha = async (req, res) => {
  const { id } = req.params;

  try {
    await canchaRepository.eliminarCancha(id);
    res.status(200).json({ msg: "Cancha eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.json({error:error.message});
  }
};

//visualizar la disponibilidad de la cancha
const disponibilidadCancha = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new Error("El id no existe");
  }

  // Crea una nueva instancia de la fecha actual
  let Fechas = new Date();
  // Obtiene la hora actual en UTC (hora local - desfase horario)
  const horaUTC = Fechas.getUTCHours();
  // Transforma la fecha a UTC-3
  Fechas.setUTCHours(horaUTC - 3);
  const fechaHoy = Fechas.toISOString().slice(0, 10); // Imprime la fecha en formato ISO 8601

  try {
    const disponibilidad = await reserva.findAll({
      where: {
        id_cancha: id,
        fecha: fechaHoy,
        estado: "disponible",
      },
      order: [["horario", "ASC"]],
    });


    res.status(200).json(disponibilidad);
  } catch (error) {
    console.log(error);
    res.json({error:error.message})
  }
};



module.exports = {
  listarCanchas,
  crearCancha,
  mostrarCancha,
  actualizarCancha,
  eliminarCancha,
  disponibilidadCancha,
};
