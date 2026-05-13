const mensajeRepository= require('../repositories/mensajeRepository')



//mostrar las notificaciones de un usuario

const mostrarMensajes = async (req,res) => {
    try {
        const { id_usuario } = req.params;
        const mensaje = await mensajeRepository.mostrarMensajes(id_usuario);
        res.status(200).json(mensaje);
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message})
    }
}

module.exports = {
    mostrarMensajes
}