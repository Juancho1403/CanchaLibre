const express = require('express');
const router = express.Router();


const {listarReservasPendientes,listarReservasConfirmadas,confirmarReserva,cancelarReserva,listarEmpresaPropietario, verReservasPendienteFecha} = require('../controllers/propietarioController');


router.get('/reservasPendientes/:id_propietario',listarReservasPendientes);
router.get('/reservasConfirmadas/:id',listarReservasConfirmadas);
router.put('/confirmarReserva/:id_reserva',confirmarReserva);
router.put('/cancelarReserva/:id_reserva',cancelarReserva);
router.get('/visualizarEmpresa/:id_propietario',listarEmpresaPropietario);
router.get('/reservasPendientesFecha/:id_cancha/:fecha',verReservasPendienteFecha);




module.exports = router;


