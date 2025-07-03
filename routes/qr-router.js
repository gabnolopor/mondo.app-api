const express = require("express");
const qrController = require("../controller/qr-controller");

const router = express.Router();

router.post("/generate", qrController.generateVoucher); // Generar nuevo vale QR
router.get("/list", qrController.getVouchers); // Obtener todos los vales
router.get("/:voucherCode", qrController.getVoucherByCode); // Obtener vale por código
router.post("/redeem", qrController.redeemVoucher); // Redimir vale
router.put("/update", qrController.updateVoucher); // Actualizar vale
router.delete("/delete/:voucherId", qrController.deleteVoucher); // Eliminar vale
router.get("/stats/summary", qrController.getVoucherStats); // Estadísticas de vales

module.exports = router; 