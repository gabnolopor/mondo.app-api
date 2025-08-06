const { conexion, ensureConnection } = require("../database");

const servicesController = {
    //funcion para obtener todos los servicios
    getServices(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let query = "SELECT * FROM services";
            conexion.query(query, (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para crear un servicio
    createService(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { name, type } = req.body;
            let query = "INSERT INTO services (name, type) VALUES (?, ?)";
            conexion.query(query, [name, type], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: result.insertId });
            });
        });
    },

    //funcion para eliminar un servicio
    deleteService(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let query = "DELETE FROM services WHERE id = ?";
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    }
};

module.exports = servicesController;
