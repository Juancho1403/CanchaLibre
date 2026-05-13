const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
const Cancha = require ('./cancha');
const Usuario = require ('./usuario');

const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  horario:{
    type: Sequelize.STRING,
    allowNull: false
  },
  estado: {
    type: Sequelize.ENUM('reservado', 'confirmado', 'disponible'),
    allowNull: false,
    defaultValue: 'disponible'
  },
  id_cancha: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Cancha,
      key: 'id_cancha'
    }
  },
  id_usuario: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  }
  }, 
  {
    timestamps: false
});

module.exports = Reserva;
