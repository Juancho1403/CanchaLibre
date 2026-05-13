var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuarioController');


router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.mostrarUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
//router.get('/reserva/id_empresa/', usuarioController.reservasConEmpresa);

module.exports = router;