const express = require("express");
const citasfController = require("../controller/citasf-controller");

const router = express.Router();

router.get("/", citasfController.getCitasF); // Route to get all facial appointments
router.delete("/:telefono", citasfController.deleteCitaF); // Route to delete an appointment by phone
router.post("/form", citasfController.createCitaF); // Route to create a new appointment

module.exports = router; 