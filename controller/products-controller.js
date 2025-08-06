const { conexion, ensureConnection } = require("../database");

const productsController = {
    //funcion para obtener todos los productos
    getProducts(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let query = "SELECT * FROM products WHERE active = 1";
            conexion.query(query, (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para obtener todos los productos (admin)
    getAllProducts(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let query = "SELECT * FROM products";
            conexion.query(query, (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para obtener un producto por ID
    getProductById(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let query = "SELECT * FROM products WHERE id = ?";
            conexion.query(query, [id], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ error: 'Product not found' });
                    return;
                }
                res.json(results[0]);
            });
        });
    },

    //funcion para crear un producto
    createProduct(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { name, description, price, stock } = req.body;
            let query = "INSERT INTO products (name, description, price, stock, active) VALUES (?, ?, ?, ?, 1)";
            conexion.query(query, [name, description, price, stock], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: result.insertId });
            });
        });
    },

    //funcion para actualizar un producto
    updateProduct(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { name, description, price, stock, active } = req.body;
            let query = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, active = ? WHERE id = ?";
            conexion.query(query, [name, description, price, stock, active, id], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para eliminar un producto
    deleteProduct(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let query = "DELETE FROM products WHERE id = ?";
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para actualizar stock
    updateStock(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { stock } = req.body;
            let query = "UPDATE products SET stock = ? WHERE id = ?";
            conexion.query(query, [stock, id], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para obtener productos por categoría
    getProductsByCategory(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { category } = req.params;
            let query = "SELECT * FROM products WHERE category = ? AND active = 1";
            conexion.query(query, [category], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    }
};

module.exports = productsController; 