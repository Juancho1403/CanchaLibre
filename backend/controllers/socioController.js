
const socioRepository= require('../repositories/socioRepository')


// enviar correo
const nodemailer = require("nodemailer");
const enviarCorreo = require('../middlewares/mandarCorreo')

const reservarCancha= async (req, res) => {
    try {

        const { id_usuario, id_cancha, fecha, horario } = req.body;
        const reserva = await socioRepository.reservaCancha(id_usuario, id_cancha, fecha, horario);

        //mandar correo
        enviarCorreo(reserva.correo,'reserva solicitada', `se ha hecho una reserva en su cancha numero ${id_cancha} para el dia ${fecha} a las ${horario} `)
        res.status(201).json({message:`se han reservado correctamente los horarios de ${horario} `});
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message})
    }


}


const VisualizarReservas= async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const reservas = await socioRepository.verReservas(id_usuario);
        
        res.status(200).json(reservas);
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message})
    }
}

const eliminarReserva = async (req, res) => {
    try {
        const { id_usuario, id_cancha,id_reserva} = req.params;
        const reserva = await socioRepository.eliminarReserva(id_usuario,id_cancha, id_reserva,);
        res.status(200).json({message:`se ha eliminado la reserva`});
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message})
    }
}

//visualizar reserva por fecha
const visualizarReservaFecha = async (req, res) => {
    try {
        const { id_cancha, fecha } = req.params;
        const reserva = await socioRepository.verReservasFecha(id_cancha, fecha);
        res.status(200).json(reserva);
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:error.message})
    }
}

const calendarioEmpresa = async (req, res) => {
    try {
        const { id_empresa, fecha } = req.params;
        const data = await socioRepository.calendarioPorEmpresa(Number(id_empresa), fecha);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    reservarCancha,
    VisualizarReservas,
    eliminarReserva,
    visualizarReservaFecha,
    calendarioEmpresa,
}
