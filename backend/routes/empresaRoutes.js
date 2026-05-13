const express = require('express');
const router = express.Router();


const empresaController = require('../controllers/empresaController');

//middlewares
const esSocio = require('../middlewares/esSocio');


router.get('/',empresaController.listarEmpresas);
router.post('/', empresaController.crearEmpresa);
router.get('/:id', empresaController.mostrarEmpresa);
router.put('/:id', empresaController.actualizarEmpresa);
router.delete('/:id', empresaController.eliminarEmpresa);
router.get('/canchas/:id_empresa', empresaController.mostrarCanchas);


module.exports = router;
