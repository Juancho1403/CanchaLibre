const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Empresa = require("./empresa");

const Cancha = sequelize.define(
  "Cancha",
  {
    id_cancha: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tipo: {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: "futbol",
    },
    precio: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.STRING(600),
      allowNull: true,
    },
    imagen_url: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    /** Inicio ventana de alquiler (HH:mm), ej. 17:00 */
    hora_inicio: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: "17:00",
    },
    /** Fin ventana de alquiler (HH:mm), ej. 22:00 */
    hora_fin: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: "22:00",
    },
    jugadores_min: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    jugadores_max: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 20,
    },
    id_empresa: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Empresa,
        key: "id_empresa",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Cancha;
