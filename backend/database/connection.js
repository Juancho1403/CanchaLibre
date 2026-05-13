const path = require("path");
const Sequelize = require("sequelize");
const {
  DB_STORAGE,
  DB_DIALECT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = require("../config/env");

const isSqlite = String(DB_DIALECT).toLowerCase() === "sqlite";

const storagePath = path.isAbsolute(DB_STORAGE)
  ? DB_STORAGE
  : path.resolve(process.cwd(), DB_STORAGE);

const sequelize = isSqlite
  ? new Sequelize({
      dialect: "sqlite",
      storage: storagePath,
      logging: false,
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: DB_DIALECT,
      logging: false,
    });

sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Conexión exitosa a la base de datos (${isSqlite ? "SQLite" : DB_DIALECT})${
        isSqlite ? `: ${storagePath}` : ""
      }`
    );
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = sequelize;
