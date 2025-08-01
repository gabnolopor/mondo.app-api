const express = require('express');
const router = express.Router();
const productsController = require('../controller/products-controller');

// Obtener todos los productos (público - solo activos)
router.get('/', productsController.getAllProducts);

// Obtener todos los productos (admin - incluye inactivos)
router.get('/admin', productsController.getAllProductsAdmin);

// Obtener un producto por ID
router.get('/:id', productsController.getProductById);

// Crear un nuevo producto
router.post('/', productsController.createProduct);

// Actualizar un producto
router.put('/:id', productsController.updateProduct);

// Eliminar un producto (cambiar a inactivo)
router.delete('/:id', productsController.deleteProduct);

// Actualizar stock de un producto
router.patch('/:id/stock', productsController.updateStock);

// Cambiar estado activo/inactivo
router.patch('/:id/toggle', productsController.toggleActive);

module.exports = router; 