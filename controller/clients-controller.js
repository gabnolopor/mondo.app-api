const { conexion, ensureConnection } = require("../database");

const clientsController = {
    //funcion para obtener los clientes
    getClients(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let comandoClients = "SELECT * FROM clients";
            conexion.query(comandoClients, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },

    //funcion para registrar un cliente
    registerClient(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { name, email, phone } = req.body;
            let comandoRegister = "INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)";
            conexion.query(comandoRegister, [name, email, phone], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para actualizar un cliente
    updateClient(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { client_id } = req.params;
            let { name, email, phone } = req.body;
            let comandoUpdate = "UPDATE clients SET name = ?, email = ?, phone = ? WHERE client_id = ?";
            conexion.query(comandoUpdate, [name, email, phone, client_id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para eliminar un cliente
    deleteClient(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { client_id } = req.params;
            let comandoDelete = "DELETE FROM clients WHERE client_id = ?";
            conexion.query(comandoDelete, [client_id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para obtener las visitas de un cliente
    getClientVisits(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { clientId } = req.params;
            let query = "SELECT v.*, s.name as service_name FROM visits v LEFT JOIN services s ON v.service_id = s.id WHERE v.client_id = ? ORDER BY v.visit_date DESC";
            conexion.query(query, [clientId], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para obtener el perfil de un cliente
    getClientProfile(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { clientId } = req.params;
            let query = "SELECT * FROM clients WHERE client_id = ?";
            conexion.query(query, [clientId], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ error: 'Client not found' });
                    return;
                }
                res.json(results[0]);
            });
        });
    },

    //funcion para agregar una visita
    addVisit(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { client_id, service_id, notes, visit_date } = req.body;
            let query = "INSERT INTO visits (client_id, service_id, notes, visit_date) VALUES (?, ?, ?, ?)";
            conexion.query(query, [client_id, service_id, notes, visit_date], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: result.insertId });
            });
        });
    },

    //funcion para eliminar una visita
    deleteVisit(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { visitId } = req.params;
            let query = "DELETE FROM visits WHERE visit_id = ?";
            conexion.query(query, [visitId], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para obtener estadísticas de visitas
    getVisitStatistics(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { clientId } = req.params;
            let query = `
                SELECT 
                    COUNT(*) as total_visits,
                    COUNT(CASE WHEN visit_date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as visits_last_30_days,
                    COUNT(CASE WHEN visit_date >= DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 1 END) as visits_last_90_days
                FROM visits 
                WHERE client_id = ?
            `;
            conexion.query(query, [clientId], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results[0]);
            });
        });
    }
};

module.exports = clientsController;
