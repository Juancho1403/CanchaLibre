const empresaRepository = require("../repositories/empresaRepository");

// Listar todas las empresas
const listarEmpresas = async (req, res) => {
  try {
    const empresas = await empresaRepository.listarEmpresas();
    res.status(200).json(empresas);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

// Crear una nueva empresa
const crearEmpresa = async (req, res) => {
  const { nombre, direccion, telefono, imagen, id_usuario } = req.body;

  try {
    const nuevaEmpresa = await empresaRepository.crearEmpresa(
      nombre,
      direccion,
      telefono,
      imagen,
      id_usuario
    );
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

// Mostrar una empresa por su ID
const mostrarEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await empresaRepository.mostrarEmpresa(id);
   
    res.status(200).json(empresa);
  } catch (error) {
    res.status(400).json({error:error.message})
  }
};

// Actualizar una empresa por su ID
const actualizarEmpresa = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono,imagen } = req.body;

  

  try {
    const empresa = await empresaRepository.actualizarEmpresa(id,nombre,direccion,telefono,imagen)
    res.status(200).json(empresa);
  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
};

// Eliminar una empresa por su ID
const eliminarEmpresa = async (req, res) => {
  const { id } = req.params;


  try {
    await empresaRepository.eliminarEmpresa(id);
    res.status(200).json({message:"Empresa eliminada correctamente"})
  } catch (error) {
    console.log(error);
    res.status(400).json({error:error.message})
  }
}

//mostras las canchas
const mostrarCanchas = async (req, res) => {
  const { id_empresa } = req.params;

  try {
    const canchas = await empresaRepository.mostrarCanchas(id_empresa);
    res.status(200).json(canchas);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listarEmpresas,
  crearEmpresa,
  mostrarEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  mostrarCanchas
};
