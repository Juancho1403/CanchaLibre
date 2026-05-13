
const contactoRepository= require('../repositories/contactoRepository')

//Mostrar todas las tablas de contacto

const mostrarContactos= async (req,res)=>{
    try{
        const contactos= await contactoRepository.mostrarContactos();
        res.status(200).json(contactos);
    }
    catch(error){
        res.status(401).json({ error: error.message });
    }
}

//Mostrar una tabla de contacto

const mostrarContacto= async (req,res)=>{
    const {id_contacto}=req.params;
    try{
        const contacto= await contactoRepository.mostrarContacto(id_contacto);
        res.status(200).json(contacto);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Crear una tabla de contacto

const crearContacto= async (req,res)=>{
    const {nombre,email,titulo,descripcion}=req.body;
    try{
        const nuevoContacto= await contactoRepository.crearContacto(nombre,email,titulo,descripcion);
        res.status(201).json({message:'Se ha creado el contacto',Contacto:nuevoContacto});
    }
    catch(error){
        console.log(error);
        res.status(400).json({error:error.message})
    }
}

//Actualizar una tabla de contacto

const actualizarContacto= async (req,res)=>{
    const {id_contacto}=req.params;
    const {nombre,email,titulo,descripcion}=req.body;
    try{
        const contacto= await contactoRepository.actualizarContacto(id_contacto,nombre,email,titulo,descripcion);
        res.status(200).json(contacto);
    }
    catch(error){
        console.log(error);
        res.status(400).json({error:error.message})
    }
}

//Eliminar una tabla de contacto

const eliminarContacto= async (req,res)=>{

    const {id_contacto}=req.params;
    try{
        await contactoRepository.eliminarContacto(id_contacto);
        res.status(200).json({message:"Contacto eliminado correctamente"})
    }
    catch(error){
        console.log(error);
        res.status(400).json({error:error.message})
    }
}

module.exports={
    mostrarContactos,
    mostrarContacto,
    crearContacto,
    actualizarContacto,
    eliminarContacto
}

