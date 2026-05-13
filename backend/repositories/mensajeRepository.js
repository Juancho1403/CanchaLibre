const Mensajes=require('../models/mensaje')


//mostrar las notificaciones de un socio por id

const mostrarMensajes = async (id_usuario) => {
    const buscarMensaje = await Mensajes.findAll({
        where: {
            id_usuario: id_usuario
        },
        attributes: ['fecha','nombre','tipo']
    
    })
    return buscarMensaje;
}


module.exports = {
    mostrarMensajes
}