const catalogoRepository = require("../repositories/catalogoRepository");

const listar = async (req, res) => {
  try {
    const { zona, precioMax, precioMin, q, fecha, franja, jugadores } = req.query;
    const canchas = await catalogoRepository.listarCatalogo({
      zona,
      precioMax,
      precioMin,
      q,
      fecha,
      franja,
      jugadores,
    });
    res.status(200).json(canchas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const detalle = async (req, res) => {
  try {
    const { id } = req.params;
    const cancha = await catalogoRepository.detalleCatalogo(id);
    if (!cancha) {
      return res.status(404).json({ success: false, message: "Cancha no encontrada" });
    }
    res.status(200).json(cancha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { listar, detalle };
