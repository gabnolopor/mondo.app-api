const { conexion, ensureConnection } = require("../database");

const masajesController = {
    //funcion para obtener los masajes
    getMasajes(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // ← AGREGAR FILTRO: solo masajes activos
            let comandoMasajes = "SELECT * FROM masajes";
            conexion.query(comandoMasajes, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },
    //funcion para obtener los ultimos masajes
    getLatestMasajes(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            // ← AGREGAR FILTRO: solo masajes activos
            let comandoMasajes = "SELECT * FROM masajes WHERE active = true ORDER BY id_masaje DESC";
            conexion.query(comandoMasajes, (err, resultados, campos) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(resultados).status(200);
            });
        });
    },
    //funcion para registrar un masaje
    masajeFormSubmit(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo } = req.body;
            let comandoForm = "INSERT INTO masajes (nombre_masaje, descripcion_masaje, precio_masaje, precio_masajePareja, duracion_masaje, precio_masajeLargo, precio_masajeLargoPareja, duracion_masajeLargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },
    //funcion para actualizar un masaje
    updateMasaje(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let { nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo } = req.body;
            let comandoUpdate = "UPDATE masajes SET nombre_masaje = ?, descripcion_masaje = ?, precio_masaje = ?, precio_masajePareja = ?, duracion_masaje = ?, precio_masajeLargo = ?, precio_masajeLargoPareja = ?, duracion_masajeLargo = ? WHERE id_masaje = ?";
            conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, precioLargo, precioLargoPareja, duracionLargo, id], (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },
    //funcion para eliminar un masaje
    deleteMasaje(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id } = req.params;
            let comandoDelete = "DELETE FROM masajes WHERE id_masaje = ?";
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
            
            const query = 'UPDATE masajes SET active = NOT active WHERE id_masaje = ?';
            
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

module.exports = masajesController;
