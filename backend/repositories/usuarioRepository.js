const usuario = require('../models/usuario');

const reserva=require('../models/reserva')
const cancha=require('../models/cancha')
const empresa=require('../models/empresa')


//listar todos los usuarios
const listarUsuarios = async ()=>{
    try {
        const usuarios = await usuario.findAll();
        return usuarios;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//actualizar un usuario


const actualizarUsuario = async (id_usuario, nombre, email, rol, password)=>{
    const buscarUsuario = await usuario.findByPk(id_usuario);

    if(!buscarUsuario){
        throw new Error('no se encontro el usuario')
    }

    try {
        const usuarioActualizado = await buscarUsuario.update({
            nombre,
            email,
            rol,
            password
        })

        return usuarioActualizado;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//mostrar un usuari0

const mostrarUsuario = async (id_usuario)=>{
    const buscarUsuario = await usuario.findByPk(id_usuario);

    if(!buscarUsuario){
        throw new Error('no se encontro el usuario')
    }

    try {   
        return buscarUsuario;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//eliminar un usuario

const eliminarUsuario = async (id_usuario)=>{
    const buscarUsuario = await usuario.findByPk(id_usuario);

    if(!buscarUsuario){
        throw new Error('no se encontro el usuario')
    }

    try {
        const usuarioEliminado = await buscarUsuario.destroy();
        return usuarioEliminado;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//traer la empresa incluida en un reserva
const reservasConEmpresa = async () => {
    const buscarReserva = await reserva.findAll({
      include: [
        {
            model: cancha,
            attributes: ["id_empresa"]
        }
    ],
    raw:true
});
    return buscarReserva
}




module.exports = {
    listarUsuarios,
    actualizarUsuario,
    mostrarUsuario,
    eliminarUsuario,
    reservasConEmpresa
}