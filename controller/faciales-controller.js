const { conexion, ensureConnection } = require("../database");

const facialesController = {
    //funcion para obtener los rituales faciales
    getFaciales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // ← AGREGAR FILTRO: solo faciales activos
            let comandoFaciales = "SELECT * FROM ritual_facial";
            conexion.query(comandoFaciales, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },
    //funcion para obtener los ultimos rituales faciales
    getLatestFaciales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // ← AGREGAR FILTRO: solo faciales activos
            let comandoFaciales = "SELECT * FROM ritual_facial WHERE active = true ORDER BY id_ritualFacial DESC";
            conexion.query(comandoFaciales, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },

    // Function to submit a facial form
    facialFormSubmit(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
            let comandoForm = "INSERT INTO ritual_facial (nombre_ritualFacial, descripcion_ritualFacial, precio_ritualFacial, precio_ritualFacialPareja, duracion_ritualFacial) VALUES (?, ?, ?, ?, ?)";
            conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    // Function to update a facial
    updateFacial(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
            let comandoUpdate = "UPDATE ritual_facial SET nombre_ritualFacial = ?, descripcion_ritualFacial = ?, precio_ritualFacial = ?, precio_ritualFacialPareja = ?, duracion_ritualFacial = ? WHERE id_ritualFacial = ?";
            conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    // Function to delete a facial
    deleteFacial(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let comandoDelete = "DELETE FROM ritual_facial WHERE id_ritualFacial = ?";
            conexion.query(comandoDelete, [id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },
    toggleActive(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { id } = req.params;
            
            const query = 'UPDATE ritual_facial SET active = NOT active WHERE id_ritualFacial = ?';
            
            conexion.query(query, [id], (err, result) => {
                if (err) {
                    console.error('Error toggling service status:', err);
                    return res.status(500).json({ error: 'Error toggling service status' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Service not found' });
                }
                
                console.log('✅ Estado del servicio cambiado exitosamente:', id);
                res.json({ message: 'Estado del servicio cambiado exitosamente' });
            });
        });
    }
};

module.exports = facialesController; 