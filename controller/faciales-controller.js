const { conexion, ensureConnection } = require("../database");

const facialesController = {
    //funcion para obtener los rituales faciales (TODOS, sin filtro de activos)
    getFaciales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // Mostrar TODOS los faciales, sin filtro de activos
            let comandoFaciales = "SELECT * FROM ritual_facial ORDER BY id_ritualFacial DESC";
            conexion.query(comandoFaciales, (err, resultados, campos) => {
                if (err) {
                    console.error('Error fetching faciales:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json(resultados);
            });
        });
    },

    //funcion para obtener los ultimos rituales faciales (SOLO activos)
    getLatestFaciales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // Solo faciales activos para la vista pública
            let comandoFaciales = "SELECT * FROM ritual_facial WHERE active = true ORDER BY id_ritualFacial DESC";
            conexion.query(comandoFaciales, (err, resultados, campos) => {
                if (err) {
                    console.error('Error fetching latest faciales:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json(resultados);
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
            
            // active se establece automáticamente como true
            let comandoForm = "INSERT INTO ritual_facial (nombre_ritualFacial, descripcion_ritualFacial, precio_ritualFacial, precio_ritualFacialPareja, duracion_ritualFacial, active) VALUES (?, ?, ?, ?, ?, true)";
            conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion], (err, resultados) => {
                if (err) {
                    console.error('Error creating facial:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ 
                    success: true, 
                    message: 'Facial creado exitosamente',
                    id: resultados.insertId 
                });
            });
        });
    },

    //funcion para actualizar un facial
    updateFacial(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
            
            // active se mantiene como true automáticamente
            let comandoUpdate = "UPDATE ritual_facial SET nombre_ritualFacial = ?, descripcion_ritualFacial = ?, precio_ritualFacial = ?, precio_ritualFacialPareja = ?, duracion_ritualFacial = ?, active = true WHERE id_ritualFacial = ?";
            conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, id], (err, resultados) => {
                if (err) {
                    console.error('Error updating facial:', err);
                    return res.status(500).json({ error: err.message });
                }
                
                if (resultados.affectedRows === 0) {
                    return res.status(404).json({ error: 'Facial no encontrado' });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Facial actualizado exitosamente' 
                });
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