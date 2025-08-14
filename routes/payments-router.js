const express = require('express');
const router = express.Router();
const paymentsController = require('../controller/payments-controller');

// Crear sesión de pago
router.post('/create-session', paymentsController.createPaymentSession);

// Webhook de Stripe
router.post('/webhook', paymentsController.handleWebhook);

// Obtener reservas pagadas
router.get('/bookings', paymentsController.getPaidBookings);

// Validar QR
router.get('/validate-qr/:qrCode', paymentsController.validateQR);

// Crear pedido de productos
router.post('/create-product-order', paymentsController.createProductOrder);

// Obtener pedidos de productos
router.get('/product-orders', paymentsController.getProductOrders);

// Actualizar estado del pedido
router.patch('/product-orders/:id/status', paymentsController.updateProductOrderStatus);

// Rastrear pedido por código QR
router.get('/track-order/:trackingCode', paymentsController.trackOrder);

// Eliminar cita pagada
router.delete('/paid-booking/:id', paymentsController.deletePaidBooking);

module.exports = router; 