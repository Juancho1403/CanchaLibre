

const empresa = require('../models/empresa')
const cancha=require('../models/cancha')


// Listar todas las empresas
const listarEmpresas = () => {
    try {
        const empresas = empresa.findAll()

        return empresas
    } catch (error) {

        return error;
    }
}

//crear una empresa

const crearEmpresa = async (nombre, direccion, telefono, imagen, id_usuario) => {

    if (!(nombre && direccion && telefono && id_usuario)) {
        throw new Error('deben estar todos los datos(nombre,direccion,telefono,imagen)');
    }

    //verificar si el usuario ya creo una empresa
    const buscarUsuario = await empresa.findOne({
        where: {
            id_usuario
        }
    })

    if (buscarUsuario) {
        throw new Error('el usuario ya tiene una empresa registrada');
    }

    try {
        const nuevaEmpresa = await empresa.create({
            nombre,
            direccion,
            telefono,
            imagen,
            id_usuario
        })
        return nuevaEmpresa;

    } catch (error) {
        return error;
    }

}


//mostrar una empresa

const mostrarEmpresa = async (id) => {
    const buscarEmpresa = await empresa.findByPk(id);

    if (!buscarEmpresa) {
        throw new Error('no se encontro la empresa');
    }

    try {

        return buscarEmpresa;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//actualizar empresa

const actualizarEmpresa = async (id, nombre, direccion, telefono, imagen) => {

    const buscarEmpresa = await empresa.findByPk(id);

    if (!buscarEmpresa) {
        throw new Error('no se encontro la empresa');
    }

    try {
        empresaActualizada = await buscarEmpresa.update({
            nombre,
            direccion,
            telefono,
            imagen
        })

        return empresaActualizada;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//eliminar una empresa

const eliminarEmpresa = async (id) => {
    const buscarEmpresa = await empresa.findByPk(id);

    if (!buscarEmpresa) {
        throw new Error('no se encontro la empresa');
    }

    try {
        empresaEliminada = await buscarEmpresa.destroy();

        return empresaEliminada

    } catch (error) {
        console.log(error);
        return error;
    }
}


const mostrarCanchas = async (id_empresa) => {
    const buscarCanchas = await cancha.findAll({
        where: {
            id_empresa
        }
    })

    try {
        return buscarCanchas;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    listarEmpresas,
    crearEmpresa,
    mostrarEmpresa,
    actualizarEmpresa,
    eliminarEmpresa,
    mostrarCanchas
}
