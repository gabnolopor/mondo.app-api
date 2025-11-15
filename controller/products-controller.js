const { pool } = require('../database');

const productsController = {
    // Obtener todos los productos
    getAllProducts(req, res) {
        const query = 'SELECT * FROM products WHERE active = true ORDER BY created_at DESC';
        
        pool.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.json(results);
        });
    },

    // Obtener todos los productos (admin - incluye inactivos)
    getAllProductsAdmin(req, res) {
        const query = 'SELECT * FROM products ORDER BY created_at DESC';
        
        pool.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Error fetching products' });
            }
            res.json(results);
        });
    },

    // Obtener un producto por ID
    getProductById(req, res) {
        const { id } = req.params;
        
        const query = 'SELECT * FROM products WHERE id = ?';
        
        pool.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching product:', err);
                return res.status(500).json({ error: 'Error fetching product' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json(results[0]);
        });
    },

    // Crear un nuevo producto
    createProduct(req, res) {
        const { name, description, price, stock } = req.body;
        
        if (!name || !description || !price || stock === undefined) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const query = `
            INSERT INTO products (name, description, price, stock, active) 
            VALUES (?, ?, ?, ?, true)
        `;
        
        pool.query(query, [name, description, price, stock], (err, result) => {
            if (err) {
                console.error('Error creating product:', err);
                return res.status(500).json({ error: 'Error creating product' });
            }
            
            console.log('✅ Producto creado exitosamente:', result.insertId);
            res.status(201).json({ 
                message: 'Producto creado exitosamente',
                productId: result.insertId 
            });
        });
    },

    // Actualizar un producto
    updateProduct(req, res) {
        const { id } = req.params;
        const { name, description, price, stock, active } = req.body;
        
        const query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, stock = ?, active = ?
            WHERE id = ?
        `;
        
        pool.query(query, [name, description, price, stock, active, id], (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ error: 'Error updating product' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            console.log('✅ Producto actualizado exitosamente:', id);
            res.json({ message: 'Producto actualizado exitosamente' });
        });
    },

    // Eliminar un producto (cambiar a inactivo)
    deleteProduct(req, res) {
        const { id } = req.params;
        
        // ← CAMBIAR A DELETE REAL
        const query = 'DELETE FROM products WHERE id = ?';
        
        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.status(500).json({ error: 'Error deleting product' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            console.log('✅ Producto eliminado completamente de la BD:', id);
            res.json({ message: 'Producto eliminado completamente' });
        });
    },

    // Actualizar stock de un producto
    updateStock(req, res) {
        const { id } = req.params;
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return res.status(400).json({ error: 'Stock debe ser un número positivo' });
        }

        const query = 'UPDATE products SET stock = ? WHERE id = ?';
        
        pool.query(query, [stock, id], (err, result) => {
            if (err) {
                console.error('Error updating stock:', err);
                return res.status(500).json({ error: 'Error updating stock' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            console.log('✅ Stock actualizado exitosamente:', id, 'Nuevo stock:', stock);
            res.json({ message: 'Stock actualizado exitosamente' });
        });
    },

    // Cambiar estado activo/inactivo
    toggleActive(req, res) {
        const { id } = req.params;
        
        const query = 'UPDATE products SET active = NOT active WHERE id = ?';
        
        pool.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error toggling product status:', err);
                return res.status(500).json({ error: 'Error toggling product status' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            console.log('✅ Estado del producto cambiado exitosamente:', id);
            res.json({ message: 'Estado del producto cambiado exitosamente' });
        });
    }
};

module.exports = productsController; 