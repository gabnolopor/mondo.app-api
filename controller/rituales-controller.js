const { conexion, ensureConnection } = require("../database");

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

    //funcion para obtener los rituales (TODOS, sin filtro de activos)
    getRituales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // Mostrar TODOS los rituales, sin filtro de activos
            let comandoRituales = "SELECT * FROM rituales ORDER BY id_ritual DESC";
            conexion.query(comandoRituales, (err, resultados, campos) => {
                if (err) {
                    console.error('Error fetching rituales:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json(resultados);
            });
        });
    },

    //funcion para obtener los ultimos rituales (SOLO activos)
    getLatestRituales(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // Solo rituales activos para la vista pública
            let comandoRituales = "SELECT * FROM rituales WHERE active = true ORDER BY id_ritual DESC";
            conexion.query(comandoRituales, (err, resultados, campos) => {
                if (err) {
                    console.error('Error fetching latest rituales:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json(resultados);
            });
        });
    },

    //funcion para registrar un ritual
    ritualFormSubmit(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
            
            // active se establece automáticamente como true
            let comandoForm = "INSERT INTO rituales (nombre_ritual, descripcion_ritual, precio_ritual, precio_ritualPareja, duracion_ritual, active) VALUES (?, ?, ?, ?, ?, true)";
            conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion], (err, resultados) => {
                if (err) {
                    console.error('Error creating ritual:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.json({ 
                    success: true, 
                    message: 'Ritual creado exitosamente',
                    id: resultados.insertId 
                });
            });
        });
    },

    //funcion para actualizar un ritual
    updateRitual(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
            
            // active se mantiene como true automáticamente
            let comandoUpdate = "UPDATE rituales SET nombre_ritual = ?, descripcion_ritual = ?, precio_ritual = ?, precio_ritualPareja = ?, duracion_ritual = ?, active = true WHERE id_ritual = ?";
            conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, id], (err, resultados) => {
                if (err) {
                    console.error('Error updating ritual:', err);
                    return res.status(500).json({ error: err.message });
                }
                
                if (resultados.affectedRows === 0) {
                    return res.status(404).json({ error: 'Ritual no encontrado' });
                }
                
                res.json({ 
                    success: true, 
                    message: 'Ritual actualizado exitosamente' 
                });
            });
        });
    },

    //funcion para eliminar un ritual
    deleteRitual(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let comandoDelete = "DELETE FROM rituales WHERE id_ritual = ?";
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
            
            const query = 'UPDATE rituales SET active = NOT active WHERE id_ritual = ?';
            
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

module.exports = ritualesController;
