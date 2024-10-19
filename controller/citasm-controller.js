const conexion = require("../database");

const citasMController = {
    //funcion para obtener las citas
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
    //funcion para eliminar una cita
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
    //funcion para crear una cita
    createCita(req, res) {
        let { nombre, correo, telefono, masaje, mensaje } = req.body;
        let comandoCreate = "INSERT INTO citasm (nombre, correo, telefono, masaje, mensaje, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        conexion.query(comandoCreate, [nombre, correo, telefono, masaje, mensaje], (err, resultados) => {
            if (err) {
                console.error("Database error:", err);
                res.status(500).json({ error: "Error al crear la cita", details: err.message });
                return;
            }
            res.status(200).json({ message: "Cita creada exitosamente" });
        });
    }
};

module.exports = citasMController;
