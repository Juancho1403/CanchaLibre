const express = require("express");
const router = express.Router();
const comunidadController = require("../controllers/comunidadController");
const { authJwt, requireSocio } = require("../middlewares/authJwt");

router.get("/partidos", authJwt, comunidadController.listarPartidos);
router.post("/partidos", authJwt, requireSocio, comunidadController.crearPartido);
router.post("/partidos/:id/unirse", authJwt, requireSocio, comunidadController.unirsePartido);

module.exports = router;
