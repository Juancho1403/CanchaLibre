const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const user = require('../models/usuario')

//config
const { TOKEN_KEY, SERVER_PORT } = require('../config/env')



router.post('/api/auth/forgotPassword', async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ message: 'Email es requerido' })
    }
    //buscar email
    const findEmail = await user.findOne({ where: { email: email } })

    if (!findEmail) {
        return res.status(404).json({ message: 'Email no encontrado' })
    }

    //guarda el token y el password secret en una constante
    const secret = TOKEN_KEY + findEmail.password
    const payload = {
        email: findEmail.email,
        id: findEmail.id
    }

    //genera el token
    const token = jwt.sign(payload, secret, { expiresIn: '15m' })

    //genera el link
    const link = `http://localhost:${SERVER_PORT}/api/auth/resetPassword/${findEmail.id}/${token}`
    console.log(link)

    res.status(200).json({ message: 'Email enviado', link: link })

})

router.get('/api/auth/resetPassword/:id/:token', async (req, res, next) => {
    const { id, token } = req.params

    //buscar el id del usuario
    const findUser = await user.findOne({ where: { id: id } })

    if (!findUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const secret = TOKEN_KEY + findUser.password
    try {

        const payload = jwt.verify(token, secret)
        const link = `http://localhost:${SERVER_PORT}/api/auth/resetPassword/${findUser.id}/${token}`
        res.status(200).json({ message: 'Token valido', payload: payload ,cambiarPassword:link})

    }
    catch (error) {
        res.status(401).json({ message: 'Token invalido' })
    }
})

router.post('/api/auth/resetPassword/:id/:token', async (req, res, next) => {
    const { id, token } = req.params
    const { password, repassword } = req.body


    if (!password || !repassword) {
        return res.status(400).json({ message: 'Las contraseñas son requeridas' })
    }

    if (password !== repassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' })
    }

    if (password.length < 9) {
        return res.status(400).json({ message: 'La contraseña debe ser mayor a 8 caracteres' })
    }

    const findUser = await user.findOne({ where: { id: id } })
    const secret = TOKEN_KEY + findUser.password

    try {
        const payload = jwt.verify(token, secret)
        let salt = bcrypt.genSaltSync(10)
        let newPassword = bcrypt.hashSync(password, salt)
        findUser.password = newPassword
        await findUser.save()
        res.status(200).json({ message: 'Contraseña actualizada' })
    }
    catch (error) {
        res.status(401).json({ message: 'Token invalido' })
    }
})

module.exports = router