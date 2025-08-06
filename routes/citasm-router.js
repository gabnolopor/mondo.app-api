const express = require("express");
const citasmController = require("../controller/citasm-controller");

const router = express.Router();

router.get("/", citasmController.getCitas); // Ruta para obtener todas las citas
router.delete("/:telefono", citasmController.deleteCita); // Ruta para eliminar una cita por teléfono
router.post("/formM", citasmController.createCita); // Ruta para crear una nueva cita

module.exports = router;
