const { Op } = require("sequelize");
const Usuario = require("../models/usuario");
const Empresa = require("../models/empresa");
const Cancha = require("../models/cancha");
const Reserva = require("../models/reserva");
const PartidoAbierto = require("../models/partidoAbierto");
const { crearCuposDisponiblesParaCanchaIds } = require("./cuposCancha");

const HORAS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

/** Imágenes en `frontend/public/canchas/` */
const IMG = {
  i: "/canchas/wanda-metropolitano.png",
  d: "/canchas/mercedes-benz-stadium.png",
  e: "/canchas/maracana.png",
  a: "/canchas/old-trafford.png",
  grama: "/canchas/estadio-azteca.png",
  promo: "/canchas/calendario-reservas-ref.png",
  campnou: "/canchas/spotify-camp-nou.png",
};

const METODOS_PAGO = JSON.stringify([
  "stripe",
  "paypal",
  "mercadopago",
  "pago_movil",
]);

async function crearCuposYDemostracion(canchaIds) {
  if (!canchaIds.length) return;
  const hoy = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    const fecha = d.toISOString().slice(0, 10);
    for (const id_cancha of canchaIds) {
      for (const horario of HORAS) {
        const existe = await Reserva.findOne({
          where: { id_cancha, fecha, horario },
        });
        if (!existe) {
          await Reserva.create({
            fecha,
            horario,
            estado: "disponible",
            id_cancha,
          });
        }
      }
    }
  }

  const f0 = hoy.toISOString().slice(0, 10);
  const [cI, cD, cE, cA, cG] = canchaIds;

  await Reserva.update(
    { estado: "reservado" },
    { where: { fecha: f0, horario: "17:00-18:00", id_cancha: { [Op.in]: canchaIds } } }
  );

  await Reserva.update(
    { estado: "reservado" },
    {
      where: {
        fecha: f0,
        horario: "18:00-19:00",
        id_cancha: { [Op.in]: [cI, cD, cE, cA] },
      },
    }
  );
  await Reserva.update(
    { estado: "disponible" },
    { where: { fecha: f0, horario: "18:00-19:00", id_cancha: cG } }
  );

  await Reserva.update(
    { estado: "reservado" },
    {
      where: {
        fecha: f0,
        horario: "19:00-20:00",
        id_cancha: { [Op.in]: [cI, cD, cE, cA] },
      },
    }
  );
  await Reserva.update(
    { estado: "disponible" },
    { where: { fecha: f0, horario: "19:00-20:00", id_cancha: cG } }
  );
}

/** Crea empresa Caracas + 5 canchas + cupos (id_usuario = propietario del complejo). */
async function crearComplejoDemo(propietarioUsuario) {
  const idUsuario = propietarioUsuario.id_usuario;
  const empresa = await Empresa.create({
    nombre: "Complejo Deportivo CanchaYa — Caracas",
    direccion: "Av. Bolívar, Urb. Centro, Caracas, Venezuela",
    telefono: "+58-212-555-0100",
    imagen: IMG.promo,
    zona: "Caracas",
    servicios: JSON.stringify([
      "Estacionamiento",
      "Vestuarios",
      "Cafetería",
      "Iluminación LED",
      "Pago móvil en recepción",
    ]),
    metodos_pago: METODOS_PAGO,
    id_usuario: idUsuario,
  });

  const created = await Cancha.bulkCreate([
    {
      nombre: "Cancha I",
      tipo: "futbol",
      precio: 35200.0,
      id_empresa: empresa.id_empresa,
      descripcion: "Sintética premium. Alquiler por hora 17:00–22:00. Equipos 10–20 jugadores.",
      imagen_url: IMG.i,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      nombre: "Cancha D",
      tipo: "futbol",
      precio: 36800.0,
      id_empresa: empresa.id_empresa,
      descripcion: "Sintética. Misma grilla de reservas que el calendario.",
      imagen_url: IMG.d,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      nombre: "Cancha E",
      tipo: "futbol",
      precio: 38400.0,
      id_empresa: empresa.id_empresa,
      descripcion: "Sintética. Ideal para partidos 7+7.",
      imagen_url: IMG.e,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      nombre: "Cancha A",
      tipo: "futbol",
      precio: 40100.0,
      id_empresa: empresa.id_empresa,
      descripcion: "Sintética. Salida a vestuarios amplios.",
      imagen_url: IMG.a,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      nombre: "*GRAMA NATURAL*",
      tipo: "futbol",
      precio: 42600.0,
      id_empresa: empresa.id_empresa,
      descripcion: "Grama natural reglamentaria. La más pedida en fines de semana.",
      imagen_url: IMG.grama,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
  ]);

  const canchaIdsRaw = created.map((c) => c.id_cancha).filter(Boolean);
  let canchaIds = canchaIdsRaw;
  if (canchaIds.length < 5) {
    const again = await Cancha.findAll({
      where: { id_empresa: empresa.id_empresa },
      order: [["id_cancha", "ASC"]],
    });
    canchaIds = again.map((c) => c.id_cancha);
  }
  await crearCuposYDemostracion(canchaIds);
}

/** Spotify Camp Nou — empresa en Barcelona (segundo propietario demo). */
async function ensureCampNouBarcelona() {
  try {
    const ya = await Empresa.findOne({ where: { zona: "Barcelona" } });
    if (ya) return;

    let prop = await Usuario.findOne({ where: { email: "campnou@test.com" } });
    if (!prop) {
      prop = await Usuario.create({
        nombre: "María Espigas — Venue Spotify",
        email: "campnou@test.com",
        password: "cnou123",
        rol: "propietario",
      });
    }

    if (await Empresa.findOne({ where: { id_usuario: prop.id_usuario } })) {
      return;
    }

    const empresa = await Empresa.create({
      nombre: "Spotify Camp Nou — Barcelona",
      direccion: "C. Arístides Maillol 12, Les Corts, Barcelona, España",
      telefono: "+34 902 189 900",
      imagen: IMG.campnou,
      zona: "Barcelona",
      servicios: JSON.stringify([
        "Gradería premium",
        "Pantallas LED",
        "Iluminación profesional",
        "Vestuarios VIP",
        "Parking",
      ]),
      metodos_pago: METODOS_PAGO,
      id_usuario: prop.id_usuario,
    });

    const c = await Cancha.create({
      nombre: "Spotify Camp Nou — Terreno de juego",
      tipo: "futbol",
      precio: 189000.0,
      id_empresa: empresa.id_empresa,
      descripcion:
        "Experiencia estadio icónico. Reservas por hora (17:00–22:00). Partidos 14–22 jugadores; ideal para eventos y exhibiciones.",
      imagen_url: IMG.campnou,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 14,
      jugadores_max: 22,
    });

    await crearCuposDisponiblesParaCanchaIds([c.id_cancha]);

    console.log("✅ Spotify Camp Nou (Barcelona) — propietario: campnou@test.com / cnou123");
  } catch (e) {
    console.error("❌ ensureCampNouBarcelona:", e.message);
  }
}

/** Tablón Comunidad: partidos abiertos de ejemplo (solo si la tabla está vacía). */
async function seedPartidosAbiertosSiVacio() {
  try {
    const n = await PartidoAbierto.count();
    if (n > 0) return;

    const socio = await Usuario.findOne({ where: { rol: "socio" }, order: [["id_usuario", "ASC"]] });
    if (!socio) {
      console.log("⚠️ Sin socios: no se crean partidos abiertos demo.");
      return;
    }

    const now = new Date();
    const t1 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const t2 = new Date(now.getTime() + 28 * 60 * 60 * 1000);
    const t3 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    t3.setHours(17, 30, 0, 0);

    await PartidoAbierto.bulkCreate([
      {
        titulo: "Fut5 mixto — buscamos rivales",
        zona: "Naguanagua",
        fecha_hora: t1,
        nivel: "Intermedio",
        cupos_buscados: 2,
        id_creador: socio.id_usuario,
        activo: true,
      },
      {
        titulo: "Pádel competitivo",
        zona: "San Diego",
        fecha_hora: t2,
        nivel: "Avanzado",
        cupos_buscados: 1,
        id_creador: socio.id_usuario,
        activo: true,
      },
      {
        titulo: "Fútbol 7 empresas",
        zona: "Valencia",
        fecha_hora: t3,
        nivel: "Relajado",
        cupos_buscados: 4,
        id_creador: socio.id_usuario,
        activo: true,
      },
    ]);
    console.log("✅ Partidos abiertos demo (Comunidad) creados.");
  } catch (e) {
    console.error("❌ seedPartidosAbiertosSiVacio:", e.message);
  }
}

/** Si ya hay usuarios pero Empresas/Canchas vacías (p. ej. solo migraron Usuarios), completa el demo. */
async function seedEmpresaCanchasSiVacio() {
  try {
    const [ne, nc] = await Promise.all([Empresa.count(), Cancha.count()]);
    if (ne > 0 || nc > 0) return;

    const dueno =
      (await Usuario.findOne({ where: { rol: "propietario" } })) ||
      (await Usuario.findOne({ where: { rol: "administrador" } })) ||
      (await Usuario.findOne({ order: [["id_usuario", "ASC"]] }));

    if (!dueno) {
      console.log("⚠️ No hay usuarios para asociar el complejo demo.");
      return;
    }

    console.log("🌱 Completando SQLite: empresa + canchas + reservas demo (Caracas)...");
    await crearComplejoDemo(dueno);
    console.log("✅ Datos de canchas y reservas listos.");
  } catch (e) {
    console.error("❌ seedEmpresaCanchasSiVacio:", e.message);
  }
}

const seedDatabase = async () => {
  try {
    const userCount = await Usuario.count();
    if (userCount === 0) {
      console.log("🌱 Seed CanchaYa (usuarios + complejo + calendario 17:00–22:00, precios Bs)...");

      await Usuario.create({
        nombre: "Administrador",
        email: "admin",
        password: "admin",
        rol: "administrador",
      });

      const propietario = await Usuario.create({
        nombre: "Carlos Propietario",
        email: "propietario@test.com",
        password: "prop123",
        rol: "propietario",
      });

      await Usuario.create({
        nombre: "Juan Socio",
        email: "socio@test.com",
        password: "socio123",
        rol: "socio",
      });

      await crearComplejoDemo(propietario);

      console.log("✅ Seed completado:");
      console.log(`   - Admin: admin / admin`);
      console.log(`   - Propietario: propietario@test.com / prop123`);
      console.log(`   - Socio: socio@test.com / socio123`);
      console.log(`   - 1 complejo Caracas + 5 canchas (I, D, E, A, Grama) + cupos demo`);
      console.log(`   - Tras el arranque: Spotify Camp Nou (Barcelona) — campnou@test.com / cnou123`);
    } else {
      console.log("📦 Ya existen usuarios; se omite creación de usuarios demo.");
    }

    await seedEmpresaCanchasSiVacio();
    await ensureCampNouBarcelona();
    await seedPartidosAbiertosSiVacio();
  } catch (error) {
    console.error("❌ Error en seed:", error.message);
  }
};

module.exports = {
  seedDatabase,
  seedEmpresaCanchasSiVacio,
  crearComplejoDemo,
  ensureCampNouBarcelona,
  seedPartidosAbiertosSiVacio,
};
