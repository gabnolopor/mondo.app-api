const conexion = require("../database");

const servicesController = {
    //funcion para obtener los servicios
    getAllServices(req, res) {
        const query = "SELECT * FROM services";
        conexion.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching services:", err);
                return res.status(500).json({ error: "Error fetching services" });
            }
            res.json(results || []); // busca un array de servicios
        });
    },
    //funcion para registrar un servicio
    addService(req, res) {
        const { name, type } = req.body;
        const query = "INSERT INTO services (name, type) VALUES (?, ?)";
        conexion.query(query, [name, type], (err, result) => {
            if (err) {
                console.error("Error adding service:", err);
                return res.status(500).json({ error: "Error adding service" });
            }
            res.status(201).json({ message: "Service added successfully", serviceId: result.insertId });
        });
    },
    //funcion para eliminar un servicio
    deleteService(req, res) {
        const { id } = req.params;
        const query = "DELETE FROM services WHERE service_id = ?";
        conexion.query(query, [id], (err, result) => {
            if (err) {
                console.error("Error deleting service:", err);
                return res.status(500).json({ error: "Error deleting service" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Service not found" });
            }
            res.json({ message: "Service deleted successfully" });
        });
    },
};

module.exports = servicesController;
