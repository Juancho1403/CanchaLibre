const { Op } = require("sequelize");
const PartidoAbierto = require("../models/partidoAbierto");
const PartidoParticipante = require("../models/partidoParticipante");
const Usuario = require("../models/usuario");

const NIVELES = ["Principiante", "Intermedio", "Avanzado", "Relajado"];

function mapPartido(row, idViewer) {
  const parts = row.participantes || [];
  const joinedIds = new Set(parts.map((p) => p.id_usuario));
  const ocupados = parts.length;
  const faltan = Math.max(0, row.cupos_buscados - ocupados);
  const yoCreador = idViewer != null && row.id_creador === idViewer;
  const yoUnido = idViewer != null && joinedIds.has(idViewer);
  return {
    id_partido: row.id_partido,
    titulo: row.titulo,
    zona: row.zona,
    fecha_hora: row.fecha_hora,
    nivel: row.nivel,
    cupos_buscados: row.cupos_buscados,
    faltan,
    creador_nombre: row.creador ? row.creador.nombre : null,
    yo_creador: yoCreador,
    yo_unido: yoUnido,
  };
}

async function listarPartidos(req, res) {
  try {
    const idViewer = req.user ? req.user.id_usuario : null;
    const desde = new Date();
    desde.setHours(desde.getHours() - 6);

    const rows = await PartidoAbierto.findAll({
      where: {
        activo: true,
        fecha_hora: { [Op.gte]: desde },
      },
      include: [
        { model: PartidoParticipante, as: "participantes", required: false },
        { model: Usuario, as: "creador", attributes: ["id_usuario", "nombre"] },
      ],
      order: [["fecha_hora", "ASC"]],
    });

    const partidos = rows.map((r) => mapPartido(r, idViewer));
    res.json({ success: true, partidos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Error al listar partidos" });
  }
}

async function crearPartido(req, res) {
  try {
    const { titulo, zona, fecha_hora, nivel, cupos_buscados } = req.body || {};
    if (!(titulo && zona && fecha_hora && nivel && cupos_buscados != null)) {
      return res.status(400).json({
        success: false,
        message: "Completá título, zona, fecha, nivel y cupos buscados",
      });
    }
    const nivelOk = NIVELES.includes(String(nivel)) ? nivel : "Intermedio";
    const cupos = Math.min(20, Math.max(1, parseInt(String(cupos_buscados), 10) || 1));
    const fh = new Date(fecha_hora);
    if (Number.isNaN(fh.getTime())) {
      return res.status(400).json({ success: false, message: "Fecha u hora inválida" });
    }

    const row = await PartidoAbierto.create({
      titulo: String(titulo).slice(0, 160),
      zona: String(zona).slice(0, 120),
      fecha_hora: fh,
      nivel: nivelOk,
      cupos_buscados: cupos,
      id_creador: req.user.id_usuario,
      activo: true,
    });

    const full = await PartidoAbierto.findByPk(row.id_partido, {
      include: [
        { model: PartidoParticipante, as: "participantes", required: false },
        { model: Usuario, as: "creador", attributes: ["id_usuario", "nombre"] },
      ],
    });

    res.status(201).json({ success: true, partido: mapPartido(full, req.user.id_usuario) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "No se pudo publicar el partido" });
  }
}

async function unirsePartido(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Id inválido" });

    const partido = await PartidoAbierto.findByPk(id, {
      include: [{ model: PartidoParticipante, as: "participantes", required: false }],
    });
    if (!partido || !partido.activo) {
      return res.status(404).json({ success: false, message: "Partido no encontrado" });
    }

    if (partido.id_creador === req.user.id_usuario) {
      return res.status(400).json({ success: false, message: "Ya sos el organizador de este partido" });
    }

    const parts = partido.participantes || [];
    if (parts.some((p) => p.id_usuario === req.user.id_usuario)) {
      return res.status(400).json({ success: false, message: "Ya estás anotado en este partido" });
    }

    const ocupados = parts.length;
    const faltan = partido.cupos_buscados - ocupados;
    if (faltan <= 0) {
      return res.status(400).json({ success: false, message: "Este partido ya está completo" });
    }

    await PartidoParticipante.create({
      id_partido: id,
      id_usuario: req.user.id_usuario,
    });

    const updated = await PartidoAbierto.findByPk(id, {
      include: [
        { model: PartidoParticipante, as: "participantes", required: false },
        { model: Usuario, as: "creador", attributes: ["id_usuario", "nombre"] },
      ],
    });

    res.json({ success: true, partido: mapPartido(updated, req.user.id_usuario) });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ success: false, message: "Ya estás anotado" });
    }
    console.error(e);
    res.status(500).json({ success: false, message: "No se pudo unir al partido" });
  }
}

module.exports = { listarPartidos, crearPartido, unirsePartido, NIVELES };
