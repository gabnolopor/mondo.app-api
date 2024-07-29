const express = require("express");
const ritualesController = require("../controller/rituales-controller");

const router = express.Router();

router.get("/", ritualesController.getRituales);
router.get("/latest", ritualesController.getLatestRituales);
router.post("/form", ritualesController.ritualFormSubmit);
router.put("/:id", ritualesController.updateRitual); // Ruta para actualizar
router.delete("/:id", ritualesController.deleteRitual); // Ruta para eliminar

module.exports = router;
