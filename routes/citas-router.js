const express = require("express");
const citasController = require("../controller/citas-controller");

const router = express.Router();

router.get("/", citasController.getCitas); // Ruta para obtener todas las citas
router.delete("/:telefono", citasController.deleteCita); // Ruta para eliminar una cita por teléfono
router.post("/form", citasController.createCita); // Ruta para crear una nueva cita

module.exports = router;
