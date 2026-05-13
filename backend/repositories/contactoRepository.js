const contacto= require('../models/contacto')

//Mostrar todas las tablas de contacto

const mostrarContactos= ()=>{
    try{
        const contactos= contacto.findAll();
        return contactos;
    }
    catch(error){
        return error;
    }
}


//Mostrar una tabla de contacto por id

const mostrarContacto= async (id_contacto)=>{
    const buscarContacto= await contacto.findByPk(id_contacto);

    if(!buscarContacto){
        throw new Error('no se encontro el contacto');
    }

    try{
        return buscarContacto;
    }
    catch(error){
        console.log(error);
        return error;
    }
}

//Crear una tabla de contacto

const crearContacto= async (nombre, email, titulo, descripcion)=>{

    if (!(nombre && email)){
        throw new Error('El nombre y el email deben ser obligatorios');
    }

    try{
        const newContacto= await contacto.create({
            nombre,
            email,
            titulo,
            descripcion
        })

        return newContacto;
    }
    catch(error){
        return error;
    }
}

//Actualizar una tabla de contacto

const actualizarContacto= async (id_contacto, nombre, email, titulo, descripcion)=>{

    const buscarContacto = await contacto.findOne({
        where: {
            id_contacto
        }
    })

    if(!buscarContacto){
        throw new Error('no se encontro el contacto');
    }

    try{
        contactoActualizado= await buscarContacto.update({
            nombre,
            email,
            titulo,
            descripcion
        })

        return contactoActualizado;
    }
    catch(error){
        return error;
    }
}

//Eliminar una tabla de contacto

const eliminarContacto= async (id_contacto)=>{
    const buscarContacto= await contacto.findByPk(id_contacto);

    if(!buscarContacto){
        throw new Error('no se encontro el contacto');
    }

    try{
        const contactoEliminado= await buscarContacto.destroy();
        return contactoEliminado;
    }
    catch(error){
        return error;
    }
}

module.exports={
    mostrarContactos,
    mostrarContacto,
    crearContacto,
    actualizarContacto,
    eliminarContacto
}
