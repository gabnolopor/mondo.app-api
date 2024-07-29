const express = require("express");
const citasController = require("../controller/citas-controller");

const router = express.Router();

router.get("/", citasController.getCitas);
router.delete("/:telefono", citasController.deleteCita);
router.post("/form", citasController.createCita);

module.exports = router;
