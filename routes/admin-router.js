const express = require("express");
const adminController = require("../controller/admin-controller");

const router = express.Router();

router.get("/",adminController.checkUsuario);

module.exports = router;