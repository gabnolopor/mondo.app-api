const { pool } = require("../database");

const masajesController = {
    //funcion para obtener los masajes (TODOS, sin filtro de activos)
    getMasajes(req, res) {
        // Mostrar TODOS los masajes, sin filtro de activos
        let comandoMasajes = "SELECT * FROM masajes ORDER BY id_masaje DESC";
        pool.query(comandoMasajes, (err, resultados, campos) => {
            if (err) {
                console.error('Error fetching masajes:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json(resultados);
        });
    },

    //funcion para obtener los ultimos masajes (SOLO activos)
    getLatestMasajes(req, res) {
        // Solo masajes activos para la vista pública
        let comandoMasajes = "SELECT * FROM masajes WHERE active = true ORDER BY id_masaje DESC";
        pool.query(comandoMasajes, (err, resultados, campos) => {
            if (err) {
                console.error('Error fetching latest masajes:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json(resultados);
        });
    },

    //funcion para registrar un masaje
    masajeFormSubmit(req, res) {
        let { nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo } = req.body;
        
        // active se establece automáticamente como true
        let comandoForm = "INSERT INTO masajes (nombre_masaje, descripcion_masaje, precio_masaje, precio_masajePareja, duracion_masaje, precio_masajeLargo, precio_masajeLargoPareja, duracion_masajeLargo, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)";
        pool.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo], (err, resultados) => {
            if (err) {
                console.error('Error creating masaje:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ 
                success: true, 
                message: 'Masaje creado exitosamente',
                id: resultados.insertId 
            });
        });
    },

    //funcion para actualizar un masaje
    updateMasaje(req, res) {
        let { id } = req.params;
        let { nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo } = req.body;
        
        // active se mantiene como true automáticamente
        let comandoUpdate = "UPDATE masajes SET nombre_masaje = ?, descripcion_masaje = ?, precio_masaje = ?, precio_masajePareja = ?, duracion_masaje = ?, precio_masajeLargo = ?, precio_masajeLargoPareja = ?, duracion_masajeLargo = ?, active = true WHERE id_masaje = ?";
        pool.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo, id], (err, resultados) => {
            if (err) {
                console.error('Error updating masaje:', err);
                return res.status(500).json({ error: err.message });
            }
            
            if (resultados.affectedRows === 0) {
                return res.status(404).json({ error: 'Masaje no encontrado' });
            }
            
            res.json({ 
                success: true, 
                message: 'Masaje actualizado exitosamente' 
            });
        });
    },
    //funcion para eliminar un masaje
    deleteMasaje(req, res) {
        let { id } = req.params;
        let comandoDelete = "DELETE FROM masajes WHERE id_masaje = ?";
        pool.query(comandoDelete, [id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    },
    toggleActive(req, res) {
        const { id } = req.params;
        
        const query = 'UPDATE masajes SET active = NOT active WHERE id_masaje = ?';
        
        pool.query(query, [id], (err, result) => {
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
    }
};

module.exports = masajesController;
