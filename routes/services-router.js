const express = require('express');
const router = express.Router();
const servicesController = require('../controller/services-controller');

// Obtiene todos los servicios
router.get('/', servicesController.getAllServices);

// Añade un nuevo servicio
router.post('/add', servicesController.addService);

// Elimina un servicio
router.delete('/delete/:id', servicesController.deleteService);

module.exports = router;
