const router= require('express').Router();


const {mostrarMensajes} = require('../controllers/mensajeController')

router.get('/mensajes/:id_usuario',mostrarMensajes)


module.exports=router