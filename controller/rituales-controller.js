const conexion = require("../database");

const ritualesController = {
    //funcion para obtener los rituales
    getRituales(req, res) {
        let comandoRituales = "SELECT * FROM rituales";
        conexion.query(comandoRituales, (err, resultados, campos) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(resultados).status(200);
        });
    },

    //funcion para obtener los ultimos rituales
    getLatestRituales(req, res) {
        console.log('🔧 getLatestRituales called');
        console.log('🔧 Environment variables check:');
        console.log('   DB_HOST:', process.env.DB_HOST ? 'Set' : 'Not set');
        console.log('   DB_USER:', process.env.DB_USER ? 'Set' : 'Not set');
        console.log('   DB_DATABASE:', process.env.DB_DATABASE ? 'Set' : 'Not set');
        console.log('   DB_PORT:', process.env.DB_PORT ? 'Set' : 'Not set');
        
        if (!conexion) {
            console.error('❌ Database connection is null');
            return res.status(500).json({ error: 'Database connection not available' });
        }
        
        console.log('🔧 Database connection status:', conexion ? 'Connected' : 'Not connected');
        
        let comandoRituales = "SELECT * FROM rituales ORDER BY id_ritual DESC";
        console.log('🔧 SQL Query:', comandoRituales);
        
        conexion.query(comandoRituales, (err, resultados, campos) => {
            if (err) {
                console.error('❌ Database error in getLatestRituales:', err);
                console.error('❌ Error message:', err.message);
                console.error('❌ Error code:', err.code);
                console.error('❌ SQL State:', err.sqlState);
                res.status(500).json({ 
                    error: err.message,
                    code: err.code,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState
                });
                return;
            }
            console.log('✅ getLatestRituales successful, results count:', resultados.length);
            res.json(resultados).status(200);
        });
    },

    //funcion para registrar un ritual
    ritualFormSubmit(req, res) {
        let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
        let comandoForm = "INSERT INTO rituales (nombre_ritual, descripcion_ritual, precio_ritual, precio_ritualPareja, duracion_ritual) VALUES (?, ?, ?, ?, ?)";
        conexion.query(comandoForm, [nombre, descripcion, precio, precioPareja, duracion], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    },

    //funcion para actualizar un ritual
    updateRitual(req, res) {
        let { id } = req.params;
        let { nombre, descripcion, precio, precioPareja, duracion } = req.body;
        let comandoUpdate = "UPDATE rituales SET nombre_ritual = ?, descripcion_ritual = ?, precio_ritual = ?, precio_ritualPareja = ?, duracion_ritual = ? WHERE id_ritual = ?";
        conexion.query(comandoUpdate, [nombre, descripcion, precio, precioPareja, duracion, id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    },

    //funcion para eliminar un ritual
    deleteRitual(req, res) {
        let { id } = req.params;
        let comandoDelete = "DELETE FROM rituales WHERE id_ritual = ?";
        conexion.query(comandoDelete, [id], (err, resultados) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.sendStatus(200);
        });
    }
};

module.exports = ritualesController;
