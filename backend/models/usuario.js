const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rol: {
      type: Sequelize.ENUM("administrador", "socio", "propietario"),
      allowNull: false,
      defaultValue: "socio", // Valor por defecto para el campo rol
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Usuario;
