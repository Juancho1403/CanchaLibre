import { readTable, writeTable } from "./db";

const IMG = {
  i: "/canchas/wanda-metropolitano.png",
  d: "/canchas/mercedes-benz-stadium.png",
  e: "/canchas/maracana.png",
  a: "/canchas/old-trafford.png",
  grama: "/canchas/estadio-azteca.png",
  promo: "/canchas/calendario-reservas-ref.png",
  cnou: "/canchas/spotify-camp-nou.png",
};

const METODOS_PAGO = JSON.stringify([
  "stripe",
  "paypal",
  "mercadopago",
  "pago_movil",
]);

const HORAS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

function addDays(isoDate, n) {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function applyDemoPattern(reservas, canchaIds, f0) {
  const [cI, cD, cE, cA, cG] = canchaIds;
  const by = (patch, pred) => {
    for (const r of reservas) {
      if (pred(r)) Object.assign(r, patch);
    }
  };
  by(
    { estado: "reservado" },
    (r) => r.fecha === f0 && r.horario === "17:00-18:00" && canchaIds.includes(r.id_cancha)
  );
  by(
    { estado: "reservado" },
    (r) =>
      r.fecha === f0 &&
      r.horario === "18:00-19:00" &&
      [cI, cD, cE, cA].includes(r.id_cancha)
  );
  by({ estado: "disponible", id_usuario: null }, (r) => r.fecha === f0 && r.horario === "18:00-19:00" && r.id_cancha === cG);
  by(
    { estado: "reservado" },
    (r) =>
      r.fecha === f0 &&
      r.horario === "19:00-20:00" &&
      [cI, cD, cE, cA].includes(r.id_cancha)
  );
  by({ estado: "disponible", id_usuario: null }, (r) => r.fecha === f0 && r.horario === "19:00-20:00" && r.id_cancha === cG);
}

/** Si no hay empresas, crea demo completo (usuarios solo si la tabla está vacía). */
export function ensureLocalSeed() {
  if (readTable("Empresas").length > 0) return;

  const hoy = new Date().toISOString().slice(0, 10);

  let usuarios = readTable("Usuarios");
  if (!usuarios.length) {
    usuarios = [
      {
        id_usuario: 1,
        nombre: "Administrador",
        email: "admin",
        password: "admin",
        rol: "administrador",
      },
      {
        id_usuario: 2,
        nombre: "Carlos Propietario",
        email: "propietario@test.com",
        password: "prop123",
        rol: "propietario",
      },
      {
        id_usuario: 3,
        nombre: "Juan Socio",
        email: "socio@test.com",
        password: "socio123",
        rol: "socio",
      },
      {
        id_usuario: 4,
        nombre: "María Espigas — Venue Spotify",
        email: "campnou@test.com",
        password: "cnou123",
        rol: "propietario",
      },
    ];
    writeTable("Usuarios", usuarios);
  }

  const propCaracas = usuarios.find((u) => u.email === "propietario@test.com") || usuarios[0];
  const propBarca = usuarios.find((u) => u.email === "campnou@test.com");

  const empresaCaracas = {
    id_empresa: 1,
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
    id_usuario: propCaracas.id_usuario,
  };

  const empresaBarcelona = {
    id_empresa: 2,
    nombre: "Spotify Camp Nou — Barcelona",
    direccion: "C. Arístides Maillol 12, Les Corts, Barcelona, España",
    telefono: "+34 902 189 900",
    imagen: IMG.cnou,
    zona: "Barcelona",
    servicios: JSON.stringify([
      "Gradería premium",
      "Pantallas LED",
      "Iluminación profesional",
      "Vestuarios VIP",
      "Parking",
    ]),
    metodos_pago: METODOS_PAGO,
    id_usuario: propBarca ? propBarca.id_usuario : propCaracas.id_usuario,
  };

  writeTable("Empresas", [empresaCaracas, empresaBarcelona]);

  const canchas = [
    {
      id_cancha: 1,
      nombre: "Cancha I",
      tipo: "futbol",
      precio: 35200,
      id_empresa: 1,
      descripcion: "Sintética premium. Alquiler por hora 17:00–22:00. Equipos 10–20 jugadores.",
      imagen_url: IMG.i,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      id_cancha: 2,
      nombre: "Cancha D",
      tipo: "futbol",
      precio: 36800,
      id_empresa: 1,
      descripcion: "Sintética. Misma grilla de reservas que el calendario.",
      imagen_url: IMG.d,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      id_cancha: 3,
      nombre: "Cancha E",
      tipo: "futbol",
      precio: 38400,
      id_empresa: 1,
      descripcion: "Sintética. Ideal para partidos 7+7.",
      imagen_url: IMG.e,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      id_cancha: 4,
      nombre: "Cancha A",
      tipo: "futbol",
      precio: 40100,
      id_empresa: 1,
      descripcion: "Sintética. Salida a vestuarios amplios.",
      imagen_url: IMG.a,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      id_cancha: 5,
      nombre: "*GRAMA NATURAL*",
      tipo: "futbol",
      precio: 42600,
      id_empresa: 1,
      descripcion: "Grama natural reglamentaria. La más pedida en fines de semana.",
      imagen_url: IMG.grama,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 10,
      jugadores_max: 20,
    },
    {
      id_cancha: 6,
      nombre: "Spotify Camp Nou — Terreno de juego",
      tipo: "futbol",
      precio: 189000,
      id_empresa: 2,
      descripcion:
        "Experiencia estadio icónico. 17:00–22:00. Partidos 14–22 jugadores; eventos y exhibiciones.",
      imagen_url: IMG.cnou,
      hora_inicio: "17:00",
      hora_fin: "22:00",
      jugadores_min: 14,
      jugadores_max: 22,
    },
  ];
  writeTable("Canchas", canchas);

  const canchaIds = canchas.map((c) => c.id_cancha);
  const reservas = [];
  let rid = 1;
  for (let i = 0; i < 7; i++) {
    const fecha = addDays(hoy, i);
    for (const id_cancha of canchaIds) {
      for (const horario of HORAS) {
        reservas.push({
          id_reserva: rid++,
          fecha,
          horario,
          estado: "disponible",
          id_cancha,
          id_usuario: null,
        });
      }
    }
  }
  applyDemoPattern(reservas, [1, 2, 3, 4, 5], hoy);
  writeTable("Reservas", reservas);

  writeTable("Mensajes", readTable("Mensajes"));
  writeTable("Contactos", readTable("Contactos"));
}

/** Partidos abiertos demo para Comunidad (si la tabla está vacía y hay un socio). */
export function ensureCommunityLocalSeed() {
  if (readTable("PartidosAbiertos").length > 0) return;
  const socio = readTable("Usuarios").find((u) => u.rol === "socio");
  if (!socio) return;
  const now = Date.now();
  const rows = [
    {
      id_partido: 1,
      titulo: "Fut5 mixto — buscamos rivales",
      zona: "Naguanagua",
      fecha_hora: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      nivel: "Intermedio",
      cupos_buscados: 2,
      id_creador: socio.id_usuario,
      activo: true,
    },
    {
      id_partido: 2,
      titulo: "Pádel competitivo",
      zona: "San Diego",
      fecha_hora: new Date(now + 28 * 60 * 60 * 1000).toISOString(),
      nivel: "Avanzado",
      cupos_buscados: 1,
      id_creador: socio.id_usuario,
      activo: true,
    },
    {
      id_partido: 3,
      titulo: "Fútbol 7 empresas",
      zona: "Valencia",
      fecha_hora: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
      nivel: "Relajado",
      cupos_buscados: 4,
      id_creador: socio.id_usuario,
      activo: true,
    },
  ];
  writeTable("PartidosAbiertos", rows);
  writeTable("PartidosParticipantes", []);
}
