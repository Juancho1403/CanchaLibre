const Sequelize = require("sequelize");
const sequelize = require("../database/connection");
const Usuario = require("./usuario");
const PartidoAbierto = require("./partidoAbierto");

const PartidoParticipante = sequelize.define(
  "PartidoParticipante",
  {
    id_participacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_partido: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: PartidoAbierto, key: "id_partido" },
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: Usuario, key: "id_usuario" },
    },
  },
  {
    tableName: "partidos_participantes",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["id_partido", "id_usuario"] }],
  }
);

module.exports = PartidoParticipante;
