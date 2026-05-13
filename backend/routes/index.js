const router = require('express').Router();



//rutas del controlador


//router.use('/api/auth', require('./authRoute'));
router.use('/api/cancha', require('./canchaRoutes'));
router.use('/api/catalogo', require('./catalogoRoutes'));
router.use('/api/usuario', require('./usuarioRoutes'));
router.use('/api/empresa', require('./empresaRoutes'))
router.use('/api/reserva',require('./reservaRoutes'))
router.use('/api/auth',require('./authRoutes'))
router.use('/api/socio',require('./socioRoutes'))
router.use('/api/propietario',require('./propietarioRoutes'))
router.use('/api/mensaje',require('./mensajeRoutes'))
router.use('/api/contacto',require('./contactoRoutes'))
router.use('/api/comunidad', require('./comunidadRoutes'))
router.use('/api/admin', require('./adminRoutes'))



//para mercadopago
router.use('/api/mercadopago',require('./mercadopagoRoute'))
router.use('/api/payments', require('./paymentRoutes'))



module.exports=router