const express = require("express");
const profileController = require("../controller/profile-controller");

const router = express.Router();

router.post("/add", profileController.addProfile); // Ruta para agregar un nuevo perfil
router.get("/get/:phone_number", profileController.getProfile); // Ruta para obtener un perfil por número de teléfono

module.exports = router;
