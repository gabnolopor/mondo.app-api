const conexion = require("../database");

const citasMController = {
    getCitas(req, res) {
        let comandoCitas = "SELECT * FROM citasm";
        conexion.query(comandoCitas, (err, resultados, campos) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(resultados).status(200);
        });
    },

    deleteCita(req, res) {
        let id = req.params.telefono;
        let comandoEliminar = "DELETE FROM citasm WHERE telefono = ?";
        conexion.query(comandoEliminar, [id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: "Error al eliminar la cita" });
            } else {
                res.status(200).json({ message: "Cita eliminada correctamente" });
            }
        });
    },

    createCita(req, res) {
        let { nombre, correo, telefono, masaje, mensaje } = req.body;
        let comandoCreate = "INSERT INTO citasm (nombre, correo, telefono, masaje, mensaje) VALUES (?, ?, ?, ?, ?)";
        conexion.query(comandoCreate, [nombre, correo, telefono, masaje, mensaje], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    }
};

module.exports = citasMController;
