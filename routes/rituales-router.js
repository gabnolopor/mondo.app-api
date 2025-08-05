const express = require("express");
const ritualesController = require("../controller/rituales-controller");

const router = express.Router();

router.get("/test", ritualesController.testEndpoint); // Ruta de prueba
router.get("/", ritualesController.getRituales); // Ruta para obtener todos los rituales
router.get("/latest", ritualesController.getLatestRituales); // Ruta para obtener los últimos rituales
router.post("/form", ritualesController.ritualFormSubmit); // Ruta para enviar datos del formulario
router.put("/:id", ritualesController.updateRitual); // Ruta para actualizar
router.delete("/:id", ritualesController.deleteRitual); // Ruta para eliminar

module.exports = router;
