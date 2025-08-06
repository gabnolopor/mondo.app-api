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
                    console.error("Error al obtener las citas:", err);
                    res.status(500).json({ error: "Error al obtener las citas" });
                } else {
                    res.status(200).json(resultados);
                }
            });
        });
    },

    //funcion para eliminar una cita
    deleteCita(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let telefono = req.params.telefono;
            let comandoEliminar = "DELETE FROM citas WHERE telefono = ?";
            conexion.query(comandoEliminar, [telefono], (err, resultados) => {
                if (err) {
                    console.error("Error al eliminar la cita:", err);
                    res.status(500).json({ error: "Error al eliminar la cita" });
                } else {
                    res.status(200).json({ message: "Cita eliminada correctamente" });
                }
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
            let comandoCreate = "INSERT INTO citas (nombre, correo, telefono, ritual, mensaje, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
            conexion.query(comandoCreate, [nombre, correo, telefono, ritual, mensaje], (err, resultados) => {
                if (err) {
                    console.error("Error al crear la cita:", err);
                    res.status(500).json({ error: "Error al crear la cita" });
                } else {
                    res.status(200).json({ message: "Cita creada correctamente" });
                }
            });
        });
    }
};

module.exports = citasController;


