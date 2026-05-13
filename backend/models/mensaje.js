const Sequelize = require('sequelize');
const sequelize = require('../database/connection');

const Usuario = require ('./usuario');


const Mensaje = sequelize.define('Mensaje', {
    id_mensaje: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    nombre:{
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo:{
        type: Sequelize.ENUM('informativo', 'positivo', 'negativo'),
        allowNull: false
    },
    fecha:{
        type: Sequelize.DATE
    }
},{
    timestamps: false
})


module.exports = Mensaje;