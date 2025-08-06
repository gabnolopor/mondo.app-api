const conexion = require("../database");

const ritualesController = {
    // Endpoint de prueba simple
    testEndpoint(req, res) {
        console.log('🔧 Test endpoint called');
        res.status(200).json({ 
            message: 'Rituales endpoint is working',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    },

    //funcion para obtener los rituales
    getRituales(req, res) {
        let comandoRituales = "SELECT * FROM rituales";
        conexion.query(comandoRituales, (err, resultados, campos) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(resultados).status(200);
        });
    },

    //funcion para obtener los ultimos rituales
    getLatestRituales(req, res) {
        let comandoRituales = "SELECT * FROM rituales ORDER BY id_ritual DESC";
        conexion.query(comandoRituales, (err, resultados, campos) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(resultados).status(200);
        });
    },

    //funcion para registrar un ritual
    ritualFormSubmit(req, res) {
        let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
        let comandoForm = "INSERT INTO rituales (nombre_ritual, descripcion_ritual, precio_ritual, precio_ritualPareja, duracion_ritual) VALUES (?, ?, ?, ?, ?)";
        conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    },

    //funcion para actualizar un ritual
    updateRitual(req, res) {
        let { id } = req.params;
        let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
        let comandoUpdate = "UPDATE rituales SET nombre_ritual = ?, descripcion_ritual = ?, precio_ritual = ?, precio_ritualPareja = ?, duracion_ritual = ? WHERE id_ritual = ?";
        conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    },

    //funcion para eliminar un ritual
    deleteRitual(req, res) {
        let { id } = req.params;
        let comandoDelete = "DELETE FROM rituales WHERE id_ritual = ?";
        conexion.query(comandoDelete, [id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    }
};

module.exports = ritualesController;
