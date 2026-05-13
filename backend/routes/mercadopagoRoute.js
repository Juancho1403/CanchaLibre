const router= require('express').Router();


const {createPreference} = require('../services/mercadopago')

router.post('/create_preference',createPreference)



module.exports=router

