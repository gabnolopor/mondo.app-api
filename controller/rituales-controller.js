const conexion = require("../database");

const ritualesController = {

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
