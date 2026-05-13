const Usuario = require('../models/usuario');

const usuarioRepository = require('../repositories/usuarioRepository');



// Método para listar todos los usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioRepository.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message})
  }
};

// Método para actualizar un usuario existente
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email,rol, password } = req.body;

  
  try {
    const usuario = await usuarioRepository.actualizarUsuario(id, nombre, email, rol, password);
    await usuario.save();
    res.status(200).json(usuario);
   

  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message});
  }
};

// Método para obtener un usuario en particular
const mostrarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await usuarioRepository.mostrarUsuario(id);
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message});
  }
};

// Método para eliminar un usuario existente
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await usuarioRepository.eliminarUsuario(id);
    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message});
  }
};

const reservasConEmpresa=async(req,res)=>{
  try {
    const reservas=await usuarioRepository.reservasConEmpresa();
    res.status(200).json(reservas);
  } catch (error) {
    console.log(error);
    res.status(400).json({message:error.message})
  }
}

module.exports = {
  listarUsuarios,
  actualizarUsuario,
  mostrarUsuario,
  eliminarUsuario,
  reservasConEmpresa
};
