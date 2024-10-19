const express = require("express");
const adminController = require("../controller/admin-controller");

const router = express.Router();

router.get("/", adminController.checkUsuario); // Ruta para verificar el usuario
router.put("/update", adminController.updateUser); // Ruta para actualizar el usuario


module.exports = router;
