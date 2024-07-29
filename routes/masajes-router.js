const express = require("express");
const masajesController = require("../controller/masajes-controller");

const router = express.Router();

router.get("/", masajesController.getMasajes);
router.get("/latest", masajesController.getLatestMasajes);
router.post("/form", masajesController.masajeFormSubmit);
router.put("/:id", masajesController.updateMasaje); // Ruta para actualizar
router.delete("/:id", masajesController.deleteMasaje); // Ruta para eliminar

module.exports = router;
