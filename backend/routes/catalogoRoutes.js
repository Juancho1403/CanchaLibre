const express = require("express");
const router = express.Router();
const catalogoController = require("../controllers/catalogoController");

router.get("/canchas", catalogoController.listar);
router.get("/canchas/:id", catalogoController.detalle);

module.exports = router;
