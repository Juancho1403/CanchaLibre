import { readTable, writeTable, nextId } from "./db";
import { ensureLocalSeed, ensureCommunityLocalSeed } from "./seedInitial";
import { encodeLocalJwt, decodeLocalJwtPayload } from "./jwtLocal";

const FRANJAS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

function addDaysIso(isoDate, n) {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function norm(p) {
  if (!p) return "/";
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function fechaHoyCaracas() {
  const Fechas = new Date();
  const horaUTC = Fechas.getUTCHours();
  Fechas.setUTCHours(horaUTC - 3);
  return Fechas.toISOString().slice(0, 10);
}

function fechaConFormato() {
  const Fechas = new Date();
  const horaUTC = Fechas.getUTCHours();
  Fechas.setUTCHours(horaUTC - 3);
  return Fechas.toISOString().slice(0, 19);
}

function stripPassword(u) {
  if (!u) return u;
  const { password, ...rest } = u;
  return rest;
}

function getEmpresa(id) {
  return readTable("Empresas").find((e) => e.id_empresa === Number(id));
}

function getCancha(id) {
  return readTable("Canchas").find((c) => c.id_cancha === Number(id));
}

function attachEmpresa(c) {
  const emp = readTable("Empresas").find((e) => e.id_empresa === c.id_empresa);
  return { ...c, Empresa: emp || null };
}

function catalogFilters(canchas, query) {
  const zona = query.get("zona") || "";
  const precioMax = query.get("precioMax");
  const precioMin = query.get("precioMin");
  const q = (query.get("q") || "").toLowerCase();
  const fecha = query.get("fecha") || "";
  const franja = query.get("franja") || "";
  const jugadores = query.get("jugadores");

  let list = canchas.filter((c) => c.tipo === "futbol").map(attachEmpresa);
  list = list.filter((row) => row.Empresa);

  if (zona) {
    const z = zona.toLowerCase();
    list = list.filter((row) => {
      const e = row.Empresa;
      return (
        (e.zona && String(e.zona).toLowerCase().includes(z)) ||
        (e.direccion && String(e.direccion).toLowerCase().includes(z)) ||
        (e.nombre && String(e.nombre).toLowerCase().includes(z))
      );
    });
  }
  if (precioMin) list = list.filter((c) => Number(c.precio) >= Number(precioMin));
  if (precioMax) list = list.filter((c) => Number(c.precio) <= Number(precioMax));
  if (q) {
    list = list.filter(
      (c) =>
        String(c.nombre || "")
          .toLowerCase()
          .includes(q) ||
        String(c.descripcion || "")
          .toLowerCase()
          .includes(q)
    );
  }
  const jn = parseInt(String(jugadores ?? ""), 10);
  if (!Number.isNaN(jn) && jn > 0) {
    list = list.filter((c) => Number(c.jugadores_min) <= jn && Number(c.jugadores_max) >= jn);
  }
  if (fecha) {
    const reservas = readTable("Reservas");
    const ids = new Set();
    for (const r of reservas) {
      if (r.fecha !== fecha || r.estado !== "disponible") continue;
      if (franja && r.horario !== franja) continue;
      ids.add(r.id_cancha);
    }
    list = list.filter((c) => ids.has(c.id_cancha));
  }
  list.sort((a, b) => Number(a.precio) - Number(b.precio));
  return list;
}

function pushMensaje(id_usuario, nombre, tipo) {
  const mensajes = readTable("Mensajes");
  mensajes.push({
    id_mensaje: nextId(mensajes, "id_mensaje"),
    id_usuario,
    nombre,
    tipo,
    fecha: fechaConFormato(),
  });
  writeTable("Mensajes", mensajes);
}

function getAuthUser(options) {
  const h = options.headers;
  if (!h) return null;
  const auth = typeof h.get === "function" ? h.get("Authorization") : h.Authorization;
  if (!auth || !String(auth).startsWith("Bearer ")) return null;
  return decodeLocalJwtPayload(String(auth).slice(7).trim());
}

function mapPartidosList(idViewer) {
  const desde = Date.now() - 6 * 60 * 60 * 1000;
  const partidos = readTable("PartidosAbiertos").filter(
    (p) => p.activo !== false && new Date(p.fecha_hora).getTime() >= desde
  );
  const participantes = readTable("PartidosParticipantes");
  const usuarios = readTable("Usuarios");
  return partidos
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
    .map((p) => {
      const pp = participantes.filter((x) => x.id_partido === p.id_partido);
      const joinedIds = new Set(pp.map((x) => x.id_usuario));
      const ocupados = pp.length;
      const faltan = Math.max(0, p.cupos_buscados - ocupados);
      const creador = usuarios.find((u) => u.id_usuario === p.id_creador);
      return {
        id_partido: p.id_partido,
        titulo: p.titulo,
        zona: p.zona,
        fecha_hora: p.fecha_hora,
        nivel: p.nivel,
        cupos_buscados: p.cupos_buscados,
        faltan,
        creador_nombre: creador ? creador.nombre : null,
        yo_creador: idViewer != null && p.id_creador === idViewer,
        yo_unido: idViewer != null && joinedIds.has(idViewer),
      };
    });
}

function adminResumenLocal() {
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const pad = (n) => String(n).padStart(2, "0");
  const startStr = `${y}-${pad(m + 1)}-01`;
  const lastDay = new Date(y, m + 1, 0).getDate();
  const endStr = `${y}-${pad(m + 1)}-${pad(lastDay)}`;

  const reservas = readTable("Reservas");
  const canchas = readTable("Canchas");
  const empresas = readTable("Empresas");
  const usuarios = readTable("Usuarios");

  const mes = reservas.filter(
    (r) =>
      r.fecha >= startStr &&
      r.fecha <= endStr &&
      (r.estado === "reservado" || r.estado === "confirmado")
  );
  let ingresosEstimados = 0;
  for (const r of mes) {
    const c = canchas.find((x) => x.id_cancha === r.id_cancha);
    ingresosEstimados += Number(c?.precio || 0);
  }
  const pendientes = reservas.filter((r) => r.estado === "reservado");
  const cola = [...pendientes]
    .sort((a, b) => b.id_reserva - a.id_reserva)
    .slice(0, 12)
    .map((r) => {
      const c = canchas.find((x) => x.id_cancha === r.id_cancha);
      const e = c ? empresas.find((x) => x.id_empresa === c.id_empresa) : null;
      const u = r.id_usuario ? usuarios.find((x) => x.id_usuario === r.id_usuario) : null;
      return {
        id: r.id_reserva,
        name: u?.nombre || "Socio",
        ref: String(r.id_reserva).padStart(4, "0"),
        amount: Number(c?.precio || 0),
        status: "pending",
        fecha: r.fecha,
        horario: r.horario,
        cancha: c?.nombre,
        empresa: e?.nombre,
      };
    });

  return {
    success: true,
    ingresosEstimados,
    horasReservadas: mes.length,
    validacionesPendientes: pendientes.length,
    reservasMesCount: mes.length,
    colaPagos: cola,
  };
}

export async function handleLocalApi(endpoint, options = {}) {
  ensureLocalSeed();
  ensureCommunityLocalSeed();

  const method = (options.method || "GET").toUpperCase();
  const [rawPath, qs] = endpoint.split("?");
  const path = norm(rawPath);
  const query = new URLSearchParams(qs || "");
  let body = null;
  if (options.body && typeof options.body === "string") {
    try {
      body = JSON.parse(options.body);
    } catch {
      body = null;
    }
  }

  const throwMsg = (msg) => {
    throw new Error(msg);
  };

  /* ----- Catálogo ----- */
  if (method === "GET" && path === "/catalogo/canchas") {
    return catalogFilters(readTable("Canchas"), query);
  }
  if (method === "GET" && path.startsWith("/catalogo/canchas/")) {
    const id = Number(path.split("/").pop());
    const c = getCancha(id);
    if (!c || c.tipo !== "futbol") throwMsg("Cancha no encontrada");
    return attachEmpresa(c);
  }

  /* ----- Auth ----- */
  if (method === "POST" && path === "/auth/register") {
    const { nombre, email, password, rol: rolBody } = body || {};
    if (!(nombre && email && password)) throwMsg("Los campos no pueden estar vacios");
    const usuarios = readTable("Usuarios");
    if (usuarios.some((u) => u.email === email)) throwMsg("El email registrado ya existe");
    const rolValido =
      rolBody && ["administrador", "propietario", "socio"].includes(rolBody) ? rolBody : "socio";
    const row = {
      id_usuario: nextId(usuarios, "id_usuario"),
      nombre,
      email,
      password,
      rol: rolValido,
    };
    usuarios.push(row);
    writeTable("Usuarios", usuarios);
    const token = encodeLocalJwt({
      id_usuario: row.id_usuario,
      nombre: row.nombre,
      email: row.email,
      rol: row.rol,
    });
    return { success: true, data: stripPassword(row), token };
  }

  if (method === "POST" && path === "/auth/login") {
    const { email, password } = body || {};
    if (!(email && password)) throwMsg("Los campos email y password no pueden estar vacios");
    const u = readTable("Usuarios").find((x) => x.email === email);
    if (!u) throwMsg("El email no existe");
    if (password !== u.password) throwMsg("La contraseña es incorrecta");
    const token = encodeLocalJwt({
      id_usuario: u.id_usuario,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
    });
    return { success: true, token };
  }

  /* ----- Empresa (rutas específicas antes de /:id) ----- */
  if (method === "GET" && path === "/empresa") {
    return readTable("Empresas");
  }
  if (method === "POST" && path === "/empresa") {
    const { nombre, direccion, telefono, imagen, id_usuario, zona, servicios, metodos_pago } = body || {};
    if (!(nombre && direccion && telefono && id_usuario)) {
      throwMsg("deben estar todos los datos(nombre,direccion,telefono,imagen)");
    }
    const empresas = readTable("Empresas");
    if (empresas.some((e) => e.id_usuario === id_usuario)) {
      throwMsg("el usuario ya tiene una empresa registrada");
    }
    const row = {
      id_empresa: nextId(empresas, "id_empresa"),
      nombre,
      direccion,
      telefono,
      imagen: imagen || "",
      zona: zona || "",
      servicios: servicios || "[]",
      metodos_pago: metodos_pago || "[]",
      id_usuario,
    };
    empresas.push(row);
    writeTable("Empresas", empresas);
    return row;
  }
  const mCanchas = path.match(/^\/empresa\/canchas\/(\d+)$/);
  if (method === "GET" && mCanchas) {
    const id_empresa = Number(mCanchas[1]);
    return readTable("Canchas").filter((c) => c.id_empresa === id_empresa);
  }
  const mEmpId = path.match(/^\/empresa\/(\d+)$/);
  if (method === "GET" && mEmpId) {
    const e = getEmpresa(mEmpId[1]);
    if (!e) throwMsg("no se encontro la empresa");
    return e;
  }
  if (method === "PUT" && mEmpId) {
    const empresas = readTable("Empresas");
    const i = empresas.findIndex((e) => e.id_empresa === Number(mEmpId[1]));
    if (i < 0) throwMsg("no se encontro la empresa");
    const { nombre, direccion, telefono, imagen, zona, servicios, metodos_pago } = body || {};
    empresas[i] = {
      ...empresas[i],
      ...(nombre != null ? { nombre } : {}),
      ...(direccion != null ? { direccion } : {}),
      ...(telefono != null ? { telefono } : {}),
      ...(imagen != null ? { imagen } : {}),
      ...(zona != null ? { zona } : {}),
      ...(servicios != null ? { servicios } : {}),
      ...(metodos_pago != null ? { metodos_pago } : {}),
    };
    writeTable("Empresas", empresas);
    return empresas[i];
  }
  if (method === "DELETE" && mEmpId) {
    const id = Number(mEmpId[1]);
    let canchas = readTable("Canchas");
    const ids = canchas.filter((c) => c.id_empresa === id).map((c) => c.id_cancha);
    canchas = canchas.filter((c) => c.id_empresa !== id);
    writeTable("Canchas", canchas);
    let reservas = readTable("Reservas").filter((r) => !ids.includes(r.id_cancha));
    writeTable("Reservas", reservas);
    const empresas = readTable("Empresas").filter((e) => e.id_empresa !== id);
    writeTable("Empresas", empresas);
    return { message: "Empresa eliminada correctamente" };
  }

  /* ----- Usuario ----- */
  if (method === "GET" && path === "/usuario") {
    return readTable("Usuarios").map(stripPassword);
  }
  const mUser = path.match(/^\/usuario\/(\d+)$/);
  if (method === "GET" && mUser) {
    const u = readTable("Usuarios").find((x) => x.id_usuario === Number(mUser[1]));
    if (!u) throwMsg("Usuario no encontrado");
    return stripPassword(u);
  }
  if (method === "PUT" && mUser) {
    const usuarios = readTable("Usuarios");
    const i = usuarios.findIndex((x) => x.id_usuario === Number(mUser[1]));
    if (i < 0) throwMsg("Usuario no encontrado");
    usuarios[i] = { ...usuarios[i], ...body };
    writeTable("Usuarios", usuarios);
    return stripPassword(usuarios[i]);
  }
  if (method === "DELETE" && mUser) {
    const id = Number(mUser[1]);
    const usuarios = readTable("Usuarios").filter((u) => u.id_usuario !== id);
    writeTable("Usuarios", usuarios);
    let empresas = readTable("Empresas");
    const empIds = empresas.filter((e) => e.id_usuario === id).map((e) => e.id_empresa);
    empresas = empresas.filter((e) => e.id_usuario !== id);
    writeTable("Empresas", empresas);
    let canchas = readTable("Canchas");
    const cIds = canchas.filter((c) => empIds.includes(c.id_empresa)).map((c) => c.id_cancha);
    canchas = canchas.filter((c) => !empIds.includes(c.id_empresa));
    writeTable("Canchas", canchas);
    let reservas = readTable("Reservas").filter((r) => !cIds.includes(r.id_cancha));
    reservas = reservas.map((r) => {
      if (r.id_usuario !== id) return r;
      if (r.estado === "reservado" || r.estado === "confirmado") {
        return { ...r, id_usuario: null, estado: "disponible" };
      }
      return { ...r, id_usuario: null };
    });
    writeTable("Reservas", reservas);
    let mensajes = readTable("Mensajes").filter((m) => m.id_usuario !== id);
    writeTable("Mensajes", mensajes);
    return { message: "Usuario eliminado" };
  }

  /* ----- Socio ----- */
  if (method === "POST" && path === "/socio") {
    const { id_usuario, id_cancha, fecha, horario } = body || {};
    if (!id_usuario || !id_cancha || !fecha || !horario) {
      throwMsg("Todos los campos son obligatorios");
    }
    const reservas = readTable("Reservas");
    const clash = reservas.some(
      (r) =>
        r.estado === "reservado" &&
        r.id_usuario === id_usuario &&
        r.fecha === fecha &&
        r.horario === horario
    );
    if (clash) throwMsg("Ya tiene una reserva en ese horario");
    const idx = reservas.findIndex(
      (r) =>
        r.id_cancha === Number(id_cancha) &&
        r.fecha === fecha &&
        r.horario === horario &&
        r.estado === "disponible"
    );
    if (idx < 0) throwMsg("El horario no está disponible");
    const c = getCancha(id_cancha);
    const emp = c ? getEmpresa(c.id_empresa) : null;
    const propId = emp ? emp.id_usuario : null;
    reservas[idx] = { ...reservas[idx], id_usuario, estado: "reservado" };
    writeTable("Reservas", reservas);
    const nombreCancha = c ? c.nombre : "cancha";
    pushMensaje(
      id_usuario,
      `Se ha hecho una reserva en la cancha "${nombreCancha}" a las ${horario} para la fecha: ${fecha}`,
      "positivo"
    );
    if (propId) {
      pushMensaje(
        propId,
        `Se ha hecho una reserva en la cancha "${nombreCancha}" a las ${horario} para la fecha: ${fecha}`,
        "positivo"
      );
    }
    return { message: `se han reservado correctamente los horarios de ${horario} ` };
  }

  const mCal = path.match(/^\/socio\/calendario\/(\d+)\/([\d-]+)$/);
  if (method === "GET" && mCal) {
    const id_empresa = Number(mCal[1]);
    const fecha = mCal[2];
    const list = readTable("Canchas")
      .filter((c) => c.id_empresa === id_empresa)
      .sort((a, b) => a.id_cancha - b.id_cancha)
      .map((c) => ({
        id_cancha: c.id_cancha,
        nombre: c.nombre,
        precio: c.precio,
        imagen_url: c.imagen_url,
        hora_inicio: c.hora_inicio,
        hora_fin: c.hora_fin,
        jugadores_min: c.jugadores_min,
        jugadores_max: c.jugadores_max,
      }));
    const ids = list.map((c) => c.id_cancha);
    if (!ids.length) return { fecha, franjas: FRANJAS, canchas: [], celdas: [] };
    const celdas = readTable("Reservas")
      .filter((r) => r.fecha === fecha && ids.includes(r.id_cancha))
      .sort((a, b) => {
        const hi = FRANJAS.indexOf(a.horario);
        const hj = FRANJAS.indexOf(b.horario);
        if (hi !== hj) return hi - hj;
        return a.id_cancha - b.id_cancha;
      })
      .map((r) => ({
        id_reserva: r.id_reserva,
        id_cancha: r.id_cancha,
        horario: r.horario,
        estado: r.estado,
      }));
    return { fecha, franjas: FRANJAS, canchas: list, celdas };
  }

  const mMisU = path.match(/^\/socio\/misreservas\/(\d+)$/);
  if (method === "GET" && mMisU) {
    const id_usuario = Number(mMisU[1]);
    const canchasById = Object.fromEntries(readTable("Canchas").map((c) => [c.id_cancha, c]));
    return readTable("Reservas")
      .filter((r) => r.id_usuario === id_usuario)
      .map((r) => ({
        ...r,
        "Cancha.nombre": canchasById[r.id_cancha]?.nombre || "",
      }));
  }

  const mMisCF = path.match(/^\/socio\/misreservas\/(\d+)\/([\d-]+)$/);
  if (method === "GET" && mMisCF) {
    const id_cancha = Number(mMisCF[1]);
    const fecha = mMisCF[2];
    return readTable("Reservas")
      .filter((r) => r.id_cancha === id_cancha && r.fecha === fecha && r.estado === "disponible")
      .sort((a, b) => FRANJAS.indexOf(a.horario) - FRANJAS.indexOf(b.horario));
  }

  const mDel = path.match(/^\/socio\/misreservas\/eliminar\/(\d+)\/(\d+)\/(\d+)$/);
  if (method === "PUT" && mDel) {
    const id_usuario = Number(mDel[1]);
    const id_cancha = Number(mDel[2]);
    const id_reserva = Number(mDel[3]);
    const reservas = readTable("Reservas");
    const r = reservas.find(
      (x) => x.id_usuario === id_usuario && x.id_cancha === id_cancha && x.id_reserva === id_reserva
    );
    if (!r) throwMsg("Reserva no encontrada");
    const c = getCancha(id_cancha);
    const nombreCancha = c ? c.nombre : "cancha";
    const emp = c ? getEmpresa(c.id_empresa) : null;
    const propId = emp ? emp.id_usuario : null;
    const idx = reservas.findIndex((x) => x.id_reserva === id_reserva);
    reservas[idx] = { ...reservas[idx], estado: "disponible", id_usuario: null };
    writeTable("Reservas", reservas);
    pushMensaje(
      id_usuario,
      `Se ha eliminado una reserva en su cancha "${nombreCancha}" a las ${r.horario} para la fecha: ${r.fecha}`,
      "negativo"
    );
    if (propId) {
      pushMensaje(
        propId,
        `Se ha eliminado una reserva en su cancha "${nombreCancha}" a las ${r.horario} para la fecha: ${r.fecha}`,
        "negativo"
      );
    }
    return { message: "se ha eliminado la reserva" };
  }

  /* ----- Mensajes ----- */
  const mMsg = path.match(/^\/mensaje\/mensajes\/(\d+)$/);
  if (method === "GET" && mMsg) {
    const id = Number(mMsg[1]);
    return readTable("Mensajes")
      .filter((m) => m.id_usuario === id)
      .map((m) => ({ fecha: m.fecha, nombre: m.nombre, tipo: m.tipo }));
  }

  /* ----- Contacto ----- */
  if (method === "POST" && (path === "/contacto" || path === "/contacto/")) {
    const { nombre, email, titulo, descripcion } = body || {};
    const contactos = readTable("Contactos");
    const row = {
      id_contacto: nextId(contactos, "id_contacto"),
      nombre,
      email,
      titulo,
      descripcion,
    };
    contactos.push(row);
    writeTable("Contactos", contactos);
    return { message: "Se ha creado el contacto", Contacto: row };
  }

  /* ----- Reserva (todas) ----- */
  if (method === "GET" && path === "/reserva/todas/id_empresa") {
    const canchas = readTable("Canchas");
    return readTable("Reservas").map((r) => {
      const c = canchas.find((x) => x.id_cancha === r.id_cancha);
      return {
        ...r,
        "Cancha.id_empresa": c ? c.id_empresa : null,
      };
    });
  }

  /* ----- Cancha ----- */
  if (method === "GET" && path === "/cancha") {
    return readTable("Canchas");
  }
  const mDisp = path.match(/^\/cancha\/disponibles\/(\d+)$/);
  if (method === "GET" && mDisp) {
    const id = Number(mDisp[1]);
    const fh = fechaHoyCaracas();
    return readTable("Reservas")
      .filter((r) => r.id_cancha === id && r.fecha === fh && r.estado === "disponible")
      .sort((a, b) => FRANJAS.indexOf(a.horario) - FRANJAS.indexOf(b.horario));
  }
  if (method === "POST" && path === "/cancha") {
    const canchas = readTable("Canchas");
    const row = {
      id_cancha: nextId(canchas, "id_cancha"),
      nombre: body.nombre,
      tipo: body.tipo || "futbol",
      precio: body.precio,
      id_empresa: body.id_empresa,
      descripcion: body.descripcion || "",
      imagen_url: body.imagen_url || "",
      hora_inicio: body.hora_inicio || "17:00",
      hora_fin: body.hora_fin || "22:00",
      jugadores_min: body.jugadores_min ?? 10,
      jugadores_max: body.jugadores_max ?? 20,
    };
    canchas.push(row);
    writeTable("Canchas", canchas);
    const reservas = readTable("Reservas");
    const hoy = new Date().toISOString().slice(0, 10);
    let rid = nextId(reservas, "id_reserva");
    for (let i = 0; i < 7; i++) {
      const fecha = addDaysIso(hoy, i);
      for (const horario of FRANJAS) {
        reservas.push({
          id_reserva: rid++,
          fecha,
          horario,
          estado: "disponible",
          id_cancha: row.id_cancha,
          id_usuario: null,
        });
      }
    }
    writeTable("Reservas", reservas);
    return row;
  }
  const mCanchaId = path.match(/^\/cancha\/(\d+)$/);
  if (method === "GET" && mCanchaId) {
    const c = getCancha(mCanchaId[1]);
    if (!c) throwMsg("no se encontro la cancha");
    return c;
  }
  if (method === "PUT" && mCanchaId) {
    const canchas = readTable("Canchas");
    const i = canchas.findIndex((c) => c.id_cancha === Number(mCanchaId[1]));
    if (i < 0) throwMsg("no se encontro la cancha");
    const { nombre, tipo, precio, descripcion, imagen_url, hora_inicio, hora_fin, jugadores_min, jugadores_max } =
      body || {};
    canchas[i] = {
      ...canchas[i],
      ...(nombre != null ? { nombre } : {}),
      tipo: tipo || "futbol",
      ...(precio != null ? { precio } : {}),
      ...(descripcion != null ? { descripcion } : {}),
      ...(imagen_url != null ? { imagen_url } : {}),
      ...(hora_inicio != null ? { hora_inicio } : {}),
      ...(hora_fin != null ? { hora_fin } : {}),
      ...(jugadores_min != null ? { jugadores_min } : {}),
      ...(jugadores_max != null ? { jugadores_max } : {}),
    };
    writeTable("Canchas", canchas);
    return canchas[i];
  }
  if (method === "DELETE" && mCanchaId) {
    const id = Number(mCanchaId[1]);
    writeTable(
      "Canchas",
      readTable("Canchas").filter((c) => c.id_cancha !== id)
    );
    writeTable(
      "Reservas",
      readTable("Reservas").filter((r) => r.id_cancha !== id)
    );
    return { msg: "Cancha eliminada correctamente" };
  }

  /* ----- Propietario ----- */
  const mRP = path.match(/^\/propietario\/reservasPendientes\/(\d+)$/);
  if (method === "GET" && mRP) {
    const id_propietario = Number(mRP[1]);
    const emp = readTable("Empresas").find((e) => e.id_usuario === id_propietario);
    if (!emp) return [];
    const canchas = readTable("Canchas").filter((c) => c.id_empresa === emp.id_empresa);
    const reservas = readTable("Reservas");
    return canchas.map((c) => ({
      ...c,
      Reservas: reservas.filter((r) => r.id_cancha === c.id_cancha && r.estado === "reservado"),
    }));
  }
  const mRC = path.match(/^\/propietario\/reservasConfirmadas\/(\d+)$/);
  if (method === "GET" && mRC) {
    const id_cancha = Number(mRC[1]);
    return readTable("Reservas").filter((r) => r.id_cancha === id_cancha && r.estado === "confirmado");
  }
  const mCR = path.match(/^\/propietario\/confirmarReserva\/(\d+)$/);
  if (method === "PUT" && mCR) {
    const id_reserva = Number(mCR[1]);
    const reservas = readTable("Reservas");
    const idx = reservas.findIndex((r) => r.id_reserva === id_reserva);
    if (idx < 0) throwMsg("Reserva no encontrada");
    const r = reservas[idx];
    const c = getCancha(r.id_cancha);
    const nombreCancha = c ? c.nombre : "cancha";
    if (r.id_usuario) {
      pushMensaje(r.id_usuario, `Se ha confirmado la reserva en la cancha "${nombreCancha}"`, "informativo");
    }
    reservas[idx] = { ...r, estado: "confirmado" };
    writeTable("Reservas", reservas);
    return { menssaje: "Se ha confirmado la reservado exitosamente" };
  }
  const mCanR = path.match(/^\/propietario\/cancelarReserva\/(\d+)$/);
  if (method === "PUT" && mCanR) {
    const id_reserva = Number(mCanR[1]);
    const reservas = readTable("Reservas");
    const idx = reservas.findIndex((r) => r.id_reserva === id_reserva);
    if (idx < 0) throwMsg("Reserva no encontrada");
    reservas[idx] = { ...reservas[idx], estado: "disponible", id_usuario: null };
    writeTable("Reservas", reservas);
    return { menssaje: "Se ha cancelado la reservado exitosamente" };
  }
  const mVE = path.match(/^\/propietario\/visualizarEmpresa\/(\d+)$/);
  if (method === "GET" && mVE) {
    const id = Number(mVE[1]);
    return readTable("Empresas").find((e) => e.id_usuario === id) || null;
  }
  const mPF = path.match(/^\/propietario\/reservasPendientesFecha\/(\d+)\/([\d-]+)$/);
  if (method === "GET" && mPF) {
    const id_cancha = Number(mPF[1]);
    const fecha = mPF[2];
    return readTable("Reservas")
      .filter((r) => r.id_cancha === id_cancha && r.fecha === fecha && r.estado === "reservado")
      .sort((a, b) => FRANJAS.indexOf(a.horario) - FRANJAS.indexOf(b.horario));
  }

  /* ----- Comunidad (partidos abiertos) ----- */
  if (method === "GET" && path === "/comunidad/partidos") {
    const u = getAuthUser(options);
    const idViewer = u?.id_usuario ?? null;
    return { success: true, partidos: mapPartidosList(idViewer) };
  }
  if (method === "POST" && path === "/comunidad/partidos") {
    const u = getAuthUser(options);
    if (!u) throwMsg("Debe iniciar sesión");
    if (u.rol !== "socio") throwMsg("Solo socios pueden publicar partidos abiertos");
    const { titulo, zona, fecha_hora, nivel, cupos_buscados } = body || {};
    if (!(titulo && zona && fecha_hora && nivel && cupos_buscados != null)) {
      throwMsg("Completá título, zona, fecha, nivel y cupos buscados");
    }
    const cupos = Math.min(20, Math.max(1, parseInt(String(cupos_buscados), 10) || 1));
    const fh = new Date(fecha_hora);
    if (Number.isNaN(fh.getTime())) throwMsg("Fecha u hora inválida");
    const partidos = readTable("PartidosAbiertos");
    const row = {
      id_partido: nextId(partidos, "id_partido"),
      titulo: String(titulo).slice(0, 160),
      zona: String(zona).slice(0, 120),
      fecha_hora: fh.toISOString(),
      nivel: String(nivel),
      cupos_buscados: cupos,
      id_creador: u.id_usuario,
      activo: true,
    };
    partidos.push(row);
    writeTable("PartidosAbiertos", partidos);
    return { success: true, partido: mapPartidosList(u.id_usuario).find((p) => p.id_partido === row.id_partido) };
  }
  const mUnirse = path.match(/^\/comunidad\/partidos\/(\d+)\/unirse$/);
  if (method === "POST" && mUnirse) {
    const u = getAuthUser(options);
    if (!u) throwMsg("Debe iniciar sesión");
    if (u.rol !== "socio") throwMsg("Solo socios pueden unirse");
    const id = Number(mUnirse[1]);
    const partidos = readTable("PartidosAbiertos");
    const p = partidos.find((x) => x.id_partido === id);
    if (!p || p.activo === false) throwMsg("Partido no encontrado");
    if (p.id_creador === u.id_usuario) throwMsg("Ya sos el organizador de este partido");
    let participantes = readTable("PartidosParticipantes");
    if (participantes.some((x) => x.id_partido === id && x.id_usuario === u.id_usuario)) {
      throwMsg("Ya estás anotado en este partido");
    }
    const ocupados = participantes.filter((x) => x.id_partido === id).length;
    if (p.cupos_buscados - ocupados <= 0) throwMsg("Este partido ya está completo");
    participantes.push({
      id_participacion: nextId(participantes, "id_participacion"),
      id_partido: id,
      id_usuario: u.id_usuario,
    });
    writeTable("PartidosParticipantes", participantes);
    const updated = mapPartidosList(u.id_usuario).find((x) => x.id_partido === id);
    return { success: true, partido: updated };
  }

  /* ----- Admin resumen ----- */
  if (method === "GET" && path === "/admin/resumen") {
    const u = getAuthUser(options);
    if (!u) throwMsg("Debe estar logueado");
    if (u.rol !== "administrador") throwMsg("Debe tener el rol de administrador!");
    return adminResumenLocal();
  }

  throwMsg(`Modo local: ruta no implementada ${method} ${path}`);
}
