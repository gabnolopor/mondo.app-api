const express = require("express");
const citasMController = require("../controller/citasm-controller");

const router = express.Router();

router.get("/", citasMController.getCitas);
router.delete("/:telefono", citasMController.deleteCita);
router.post("/formM", citasMController.createCita);

module.exports = router;
