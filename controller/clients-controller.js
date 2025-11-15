const { pool } = require("../database");

const clientsController = {
    //funcion para obtener los clientes
    getClients(req, res) {
        let comandoClients = "SELECT * FROM clients";
        pool.query(comandoClients, (err, resultados, campos) => {
            if (err) {
                console.error("Error al obtener los clientes:", err);
                res.status(500).json({ error: "Error al obtener los clientes" });
            } else {
                res.status(200).json(resultados);
            }
        });
    },

    //funcion para registrar un cliente
    registerClient(req, res) {
        let { name, email, phone } = req.body;
        let comandoRegister = "INSERT INTO clients (name, email, phone, created_at) VALUES (?, ?, ?, NOW())";
        pool.query(comandoRegister, [name, email, phone], (err, resultados) => {
            if (err) {
                console.error("Error al registrar el cliente:", err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "Ya existe un cliente con este nombre." });
                }
                res.status(500).json({ message: "Error al registrar el cliente" });
            } else {
                res.status(200).json({ message: "Cliente registrado correctamente", clientId: resultados.insertId });
            }
        });
    },

    //funcion para actualizar un cliente
    updateClient(req, res) {
        const { client_id, name, email, phone } = req.body;
        const comandoUpdate = "UPDATE clients SET name = ?, email = ?, phone = ? WHERE client_id = ?";
        pool.query(comandoUpdate, [name, email, phone, client_id], (err, resultados) => {
            if (err) {
                console.error("Error al actualizar el cliente:", err);
                res.status(500).json({ error: "Error al actualizar el cliente" });
            } else {
                res.status(200).json({ message: "Cliente actualizado correctamente" });
            }
        });
    },

    //funcion para eliminar un cliente
    deleteClient(req, res) {
        const { client_id } = req.params;
        if (!client_id) {
            return res.status(400).json({ error: "ID del cliente no proporcionado" });
        }
        const comandoDelete = "DELETE FROM clients WHERE client_id = ?";
        pool.query(comandoDelete, [client_id], (err, resultados) => {
            if (err) {
                console.error("Error al eliminar el cliente:", err);
                return res.status(500).json({ error: "Error al eliminar el cliente", details: err.message });
            }
            if (resultados.affectedRows === 0) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            res.status(200).json({ message: "Cliente eliminado correctamente" });
        });
    },

    //funcion para obtener el numero de visitas de un cliente
    getClientVisitCount(req, res) {
        const { clientId } = req.params;
        const query = `
            SELECT COUNT(v.visit_id) as visit_count
            FROM clients c
            LEFT JOIN visits v ON c.client_id = v.client_id
            WHERE c.client_id = ?
            GROUP BY c.client_id
        `;
        pool.query(query, [clientId], (err, results) => {
            if (err) {
                console.error("Error fetching client visit count:", err);
                return res.status(500).json({ error: "Error fetching client visit count" });
            }
            res.json(results[0] || { visit_count: 0 });
        });
    },

    //funcion para obtener los servicios de un cliente
    getClientServices(req, res) {
        const { clientId } = req.params;
        const query = `
            SELECT s.name as service_name, s.type, COUNT(v.visit_id) as service_count
            FROM clients c
            JOIN visits v ON c.client_id = v.client_id
            JOIN services s ON v.service_id = s.service_id
            WHERE c.client_id = ?
            GROUP BY c.client_id, s.service_id
        `;
        pool.query(query, [clientId], (err, results) => {
            if (err) {
                console.error("Error fetching client services:", err);
                return res.status(500).json({ error: "Error fetching client services" });
            }
            res.json(results);
        });
    },

    //funcion para agregar una visita a un cliente
    addVisit(req, res) {
        const { client_id, service_id, notes, visit_date } = req.body;
        const query = `
            INSERT INTO visits (client_id, service_id, notes, visit_date)
            VALUES (?, ?, ?, ?)
        `;
        pool.query(query, [client_id, service_id, notes, visit_date], (err, result) => {
            if (err) {
                console.error("Error adding visit:", err);
                return res.status(500).json({ error: "Error adding visit" });
            }
            res.json({ message: "Visit added successfully", visit_id: result.insertId });
        });
    },

    //funcion para eliminar una visita
    deleteVisit(req, res) {
        const { visitId } = req.params;
        const query = "DELETE FROM visits WHERE visit_id = ?";
        pool.query(query, [visitId], (err, result) => {
            if (err) {
                console.error("Error deleting visit:", err);
                return res.status(500).json({ error: "Error deleting visit" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Visit not found" });
            }
            res.json({ message: "Visit deleted successfully" });
        });
    },

    //funcion para obtener las visitas de un cliente
    getClientVisits(req, res) {
        const { clientId } = req.params;
        const query = `
            SELECT v.visit_id, v.visit_date, s.name as service_name, v.notes
            FROM visits v
            JOIN services s ON v.service_id = s.service_id
            WHERE v.client_id = ?
            ORDER BY v.visit_date DESC
        `;
        pool.query(query, [clientId], (err, results) => {
            if (err) {
                console.error("Error fetching client visits:", err);
                return res.status(500).json({ error: "Error fetching client visits" });
            }
            res.json(results);
        });
    }
};

module.exports = clientsController;
