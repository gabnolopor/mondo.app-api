const express = require('express');
const router = express.Router();
const emailController = require('../controller/email-controller');

// Ruta para enviar email de consulta sobre pedido
router.post('/send-inquiry', emailController.sendInquiryEmail);

// Ruta para enviar email de contacto
router.post('/send-contact', emailController.sendContactEmail);

module.exports = router;