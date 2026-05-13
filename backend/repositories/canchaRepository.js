const cancha = require("../models/cancha");

const listarCanchas = async () => {
  try {
    return await cancha.findAll({ order: [["id_cancha", "ASC"]] });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const crearCancha = async (payload) => {
  const {
    nombre,
    tipo = "futbol",
    precio,
    id_empresa,
    descripcion,
    imagen_url,
    hora_inicio,
    hora_fin,
    jugadores_min,
    jugadores_max,
  } = payload || {};

  if (!(nombre && precio != null && id_empresa)) {
    throw new Error("faltan completar todos los campos(nombre,precio,id_empresa)");
  }

  try {
    return await cancha.create({
      nombre,
      tipo: tipo || "futbol",
      precio,
      id_empresa,
      descripcion: descripcion ?? "",
      imagen_url: imagen_url ?? "",
      hora_inicio: hora_inicio || "17:00",
      hora_fin: hora_fin || "22:00",
      jugadores_min: jugadores_min != null ? jugadores_min : 10,
      jugadores_max: jugadores_max != null ? jugadores_max : 20,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const mostrarCancha = async (id_cancha) => {
  const buscarCanchar = await cancha.findByPk(id_cancha);
  if (!buscarCanchar) {
    throw new Error("no se encontro la cancha");
  }
  return buscarCanchar;
};

const actualizarCancha = async (id_cancha, payload) => {
  const buscarCanchar = await cancha.findByPk(id_cancha);
  if (!buscarCanchar) {
    throw new Error("no se encontro la cancha");
  }
  const {
    nombre,
    tipo,
    precio,
    descripcion,
    imagen_url,
    hora_inicio,
    hora_fin,
    jugadores_min,
    jugadores_max,
  } = payload || {};

  const patch = {};
  if (nombre != null) patch.nombre = nombre;
  if (tipo != null) patch.tipo = tipo;
  if (precio != null) patch.precio = precio;
  if (descripcion != null) patch.descripcion = descripcion;
  if (imagen_url != null) patch.imagen_url = imagen_url;
  if (hora_inicio != null) patch.hora_inicio = hora_inicio;
  if (hora_fin != null) patch.hora_fin = hora_fin;
  if (jugadores_min != null) patch.jugadores_min = jugadores_min;
  if (jugadores_max != null) patch.jugadores_max = jugadores_max;
  if (patch.tipo == null) patch.tipo = "futbol";

  await buscarCanchar.update(patch);
  return buscarCanchar.reload();
};

const eliminarCancha = async (id_cancha) => {
  const buscarCanchar = await cancha.findByPk(id_cancha);
  if (!buscarCanchar) {
    throw new Error("no se encontro la cancha a eliminar");
  }
  return buscarCanchar.destroy();
};

module.exports = {
  listarCanchas,
  crearCancha,
  mostrarCancha,
  actualizarCancha,
  eliminarCancha,
};
