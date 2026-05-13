const Sequelize = require('sequelize');
const sequelize = require('../database/connection');


const contacto = sequelize.define('Contacto', {
    id_contacto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    titulo:{
        type: Sequelize.STRING,
    },
    descripcion:{
        type: Sequelize.STRING,
    }
    }, {
    timestamps: false
});


module.exports = contacto;