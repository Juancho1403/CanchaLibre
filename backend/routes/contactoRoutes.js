const express = require('express');
const router = express.Router();


const contactoController= require('../controllers/contactoController')

router.get('/', contactoController.mostrarContactos);
router.post('/', contactoController.crearContacto);
router.get('/:id_contacto', contactoController.mostrarContacto);
router.put('/:id_contacto', contactoController.actualizarContacto);
router.delete('/:id_contacto', contactoController.eliminarContacto);

module.exports = router;
