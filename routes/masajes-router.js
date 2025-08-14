const express = require("express");
const masajesController = require("../controller/masajes-controller");

const router = express.Router();

router.get("/", masajesController.getMasajes); // Ruta para obtener todos los masajes
router.get("/latest", masajesController.getLatestMasajes); // Ruta para obtener los últimos masajes 
router.post("/form", masajesController.masajeFormSubmit); // Ruta para enviar datos del formulario
router.put("/:id", masajesController.updateMasaje); // Ruta para actualizar
router.delete("/:id", masajesController.deleteMasaje); // Ruta para eliminar
router.patch("/:id/toggle", masajesController.toggleActive); // Route to toggle the active status of a masaje

module.exports = router;
