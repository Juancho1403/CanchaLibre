const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authJwt, requireAdministrador } = require("../middlewares/authJwt");

router.get("/resumen", authJwt, requireAdministrador, adminController.resumen);

module.exports = router;
