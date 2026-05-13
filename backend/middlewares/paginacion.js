const paginate = (model, pageSize) => {
    return async (req, res, next) => {
      try {
        const pageNumber = req.query.numeroPagina || 1; // Número de página
        const offset = (pageNumber - 1) * pageSize; // Desplazamiento
  
        const results = await model.findAll({
          limit: pageSize,
          offset: offset
        });
  
        res.send(results);
      } catch (error) {
        next(error);
      }
    };
  };
  
  module.exports = paginate;


/*
const express = require('express');
const paginate = require('./paginate');
const miModelo = require('./mi-modelo');

const app = express();

// Crear middleware para paginación de miModelo
const pageSize = 5; // Tamaño de página
const paginacionMiModelo = paginate(miModelo, pageSize);

// Endpoint para obtener resultados paginados de miModelo
app.get('/mi-modelo', paginacionMiModelo, (req, res) => {
  res.end();
});


*/