const express = require('express');
const router = express.Router();
const paymentsController = require('../controller/payments-controller');

// Crear sesión de pago
router.post('/create-session', paymentsController.createPaymentSession);

// Webhook de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.handleWebhook);

// Obtener reservas pagadas
router.get('/bookings', paymentsController.getPaidBookings);

// Validar QR
router.get('/validate-qr/:qrCode', paymentsController.validateQR);

module.exports = router; 