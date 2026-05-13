const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const usuarioController= require('../controllers/usuarioController')

router.get('/', reservaController.listarReservas);
router.post('/', reservaController.crearReserva);
router.get('/:id', reservaController.mostrarReserva);
router.put('/:id', reservaController.actualizarReserva);
router.delete('/:id', reservaController.eliminarReserva);
router.get('/todas/id_empresa',usuarioController.reservasConEmpresa)



module.exports = router;
