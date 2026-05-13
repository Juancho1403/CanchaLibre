//importing libraries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//importing config
const { TOKEN_KEY, EXPIRES } = require("../config/env");

//importing models
const user = require("../models/usuario");
const connection = require("../database/connection");

// Registrar usuario
const register = async ({ nombre, email, password }) => {
  if (!(nombre && password && email)) {
    throw new Error("Los campos no pueden estar vacios");
  }
  const existingUser = await user.findOne({ where: { email: email } });

  if (existingUser) {
    throw new Error("El email registrado ya existe");
  }

  const execute = await connection.transaction();
  try {
    const newUser = await user.create(
      { nombre: nombre, email: email, password, rol: "socio" },
      { transaction: execute }
    );

    // Crear token SIN incluir el password
    const token = jwt.sign(
      {
        id_usuario: newUser.id_usuario,
        nombre: nombre,
        email: newUser.email,
        rol: newUser.rol
      },
      TOKEN_KEY,
      { expiresIn: EXPIRES }
    );

    await execute.commit();
    return { newUser: newUser, token: token };
  } catch (error) {
    await execute.rollback();
    console.log(error);
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
};

// Login de usuario
const login = async (email, password) => {
  if (!(email && password)) {
    throw new Error("Los campos email y password no pueden estar vacios");
  }

  const userFound = await user.findOne({ where: { email: email } });

  if (!userFound) {
    throw new Error(`El email no existe`);
  }

  // Verificar password
  if (password !== userFound.password) {
    throw new Error(`La contraseña es incorrecta`);
  }

  // Crear token SIN incluir el password
  const token = jwt.sign(
    {
      id_usuario: userFound.id_usuario,
      nombre: userFound.nombre,
      email: userFound.email,
      rol: userFound.rol,
    },
    TOKEN_KEY,
    { expiresIn: EXPIRES }
  );

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return { token, options };
};

module.exports = {
  register,
  login,
};
