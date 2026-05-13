// ===== CanchaYa API =====
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Cargar variables de entorno
const { SERVER_PORT, DB_DIALECT } = require('./config/env');

// Cargar horarios programados
const { CargarHorarios } = require('./database/tareaProgramada');

const app = express();

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar Sequelize y modelos
const sequelize = require('./database/connection');
const Usuario = require('./models/usuario');
const Empresa = require('./models/empresa');
const Cancha = require('./models/cancha');
const Reserva = require('./models/reserva');
const Mensaje = require('./models/mensaje');
const PartidoAbierto = require('./models/partidoAbierto');
const PartidoParticipante = require('./models/partidoParticipante');

// Definir relaciones entre los modelos
Empresa.hasMany(Cancha, { foreignKey: 'id_empresa' });
Cancha.belongsTo(Empresa, { foreignKey: 'id_empresa' });

Usuario.hasMany(Reserva, { foreignKey: 'id_usuario' });
Reserva.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Cancha.hasMany(Reserva, { foreignKey: 'id_cancha' });
Reserva.belongsTo(Cancha, { foreignKey: 'id_cancha' });

Empresa.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Usuario.hasOne(Empresa, { foreignKey: 'id_usuario' });

Usuario.hasMany(Mensaje, { foreignKey: 'id_usuario' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasMany(PartidoAbierto, { foreignKey: 'id_creador' });
PartidoAbierto.belongsTo(Usuario, { foreignKey: 'id_creador', as: 'creador' });

PartidoAbierto.hasMany(PartidoParticipante, { foreignKey: 'id_partido', as: 'participantes' });
PartidoParticipante.belongsTo(PartidoAbierto, { foreignKey: 'id_partido' });
Usuario.hasMany(PartidoParticipante, { foreignKey: 'id_usuario' });
PartidoParticipante.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const { authJwt } = require('./middlewares/authJwt');
app.use(authJwt);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    app: 'CanchaYa',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use('/', require('./routes/index'));

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(SERVER_PORT, () => {
  console.log(`\n🚀 CanchaYa API → http://localhost:${SERVER_PORT}`);
  const syncOpts = process.env.DB_SYNC_ALTER === 'true' ? { alter: true } : {};
  sequelize.sync(syncOpts)
    .then(async () => {
      const dbLabel =
        String(DB_DIALECT || "").toLowerCase() === "sqlite" ? "SQLite" : String(DB_DIALECT || "SQL");
      console.log(
        syncOpts.alter
          ? `✅ Base de datos ${dbLabel} sincronizada (alter)`
          : `✅ Base de datos ${dbLabel} sincronizada`
      );

      const { ensureSchema } = require("./database/ensureSchema");
      await ensureSchema(sequelize, Empresa, Cancha);
      
      // Ejecutar seed si la base de datos está vacía
      const { seedDatabase } = require('./database/seed');
      await seedDatabase();
      const { ensureBootstrapAdmin } = require('./database/ensureAdmin');
      await ensureBootstrapAdmin();
      
      // Cargar horarios programados
      CargarHorarios();
    })
    .catch(err => {
      console.error('❌ Error al sincronizar la base de datos:', err);
    });
});
