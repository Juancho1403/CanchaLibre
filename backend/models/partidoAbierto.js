const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Usuario = require("./usuario");

const PartidoAbierto = sequelize.define(
  "PartidoAbierto",
  {
    id_partido: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: Sequelize.STRING(160),
      allowNull: false,
    },
    zona: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    fecha_hora: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    nivel: {
      type: Sequelize.STRING(40),
      allowNull: false,
    },
    cupos_buscados: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_creador: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Usuario, key: "id_usuario" },
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "partidos_abiertos",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = PartidoAbierto;
