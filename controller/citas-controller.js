const { conexion, ensureConnection } = require("../database");

const citasController = {
    //funcion para obtener las citas
    getCitas(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let comandoCitas = "SELECT * FROM citas";
            conexion.query(comandoCitas, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },

    //funcion para eliminar una cita
    deleteCita(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let comandoEliminar = "DELETE FROM citas WHERE id = ?";
            conexion.query(comandoEliminar, [id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para crear una cita
    createCita(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { nombre, correo, telefono, ritual, mensaje } = req.body;
            let comandoCreate = "INSERT INTO citas (nombre, correo, telefono, ritual, mensaje) VALUES (?, ?, ?, ?, ?)";
            conexion.query(comandoCreate, [nombre, correo, telefono, ritual, mensaje], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    }
};

module.exports = citasController;


