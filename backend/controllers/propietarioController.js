const propietarioRepository= require('../repositories/propietarioRepository')


// listar todos las reservas en estado pendiente con su cancha particular

const listarReservasPendientes = async (req, res) => {
    const { id_propietario } = req.params;
    try {
        const reservas = await propietarioRepository.listarReservasPendientes(id_propietario);
        res.status(200).json(reservas);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}

// listar todos las reservas en estado confirmado con su cancha particular

const listarReservasConfirmadas = async (req, res) => {
    const { id } = req.params;
    try {
        const reservas = await propietarioRepository.listarReservasConfirmadas(id);
        res.status(200).json(reservas);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}

// cambiar la reserva a confirmado de una  reserva especifica

const confirmarReserva = async (req, res) => {
    const { id_reserva } = req.params;
    try {
        const reserva = await propietarioRepository.confirmarReserva(id_reserva);
        res.status(200).json({menssaje:'Se ha confirmado la reservado exitosamente'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}

// cambiar la reserva a cancelado de una reserva especifica

const cancelarReserva = async (req, res) => {
    const { id_reserva } = req.params;
    try {
        const reserva = await propietarioRepository.cancelarReserva(id_reserva);
        res.status(200).json({menssaje:'Se ha cancelado la reservado exitosamente'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}

//visualizar empresa del usuario

const listarEmpresaPropietario = async (req, res) => {
    const { id_propietario } = req.params;
    try {
        const empresa = await propietarioRepository.listarEmpresaPropietario(id_propietario);
        res.status(200).json(empresa);
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}

//visualizar reservas pendientes por fecha
const verReservasPendienteFecha= async(req,res)=>{
    const {id_cancha,fecha}= req.params;
    try {
        const reservas= await propietarioRepository.verReservasPendienteFecha(id_cancha,fecha);
        res.status(200).json(reservas);
    }
    catch (error) {
        res.status(400).json({message:error.message});
    }
}


module.exports = {
    listarReservasPendientes,
    listarReservasConfirmadas,
    confirmarReserva,
    cancelarReserva,
    listarEmpresaPropietario,
    verReservasPendienteFecha
}

