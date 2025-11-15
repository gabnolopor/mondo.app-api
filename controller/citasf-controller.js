const { pool } = require("../database");

const citasfController = {
    //function to get facial appointments
    getCitasF(req, res) {
        let comandoCitas = "SELECT * FROM citasf";
        pool.query(comandoCitas, (err, resultados, campos) => {
            if (err) {
                console.error("Error al obtener las citas faciales:", err);
                res.status(500).json({ error: "Error al obtener las citas faciales" });
            } else {
                res.status(200).json(resultados);
            }
        });
    },

    //function to delete a facial appointment
    deleteCitaF(req, res) {
        let telefono = req.params.telefono;
        let comandoEliminar = "DELETE FROM citasf WHERE telefono = ?";
        pool.query(comandoEliminar, [telefono], (err, resultados) => {
            if (err) {
                console.error("Error al eliminar la cita facial:", err);
                res.status(500).json({ error: "Error al eliminar la cita facial" });
            } else {
                res.status(200).json({ message: "Cita facial eliminada correctamente" });
            }
        });
    },

    //function to create a facial appointment
    createCitaF(req, res) {
        let { nombre, correo, telefono, facial, mensaje } = req.body;
        let comandoCreate = "INSERT INTO citasf (nombre, correo, telefono, facial, mensaje, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        pool.query(comandoCreate, [nombre, correo, telefono, facial, mensaje], (err, resultados) => {
            if (err) {
                console.error("Error al crear la cita facial:", err);
                res.status(500).json({ error: "Error al crear la cita facial" });
            } else {
                res.status(200).json({ message: "Cita facial creada correctamente" });
            }
        });
    }
};

module.exports = citasfController; 