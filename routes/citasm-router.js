const express = require("express");
const citasMController = require("../controller/citasm-controller");

const router = express.Router();

router.get("/", citasMController.getCitas); // Ruta para obtener todas las citas
router.delete("/:telefono", citasMController.deleteCita); // Ruta para eliminar una cita por teléfono
router.post("/formM", citasMController.createCita); // Ruta para crear una nueva cita

module.exports = router;
