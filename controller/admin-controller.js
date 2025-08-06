const { conexion, ensureConnection } = require("../database");

const adminController = {
    //funcion para hacer login
    login(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { nombre, password } = req.body;
            let comandoLog = "SELECT * FROM admin WHERE nombre = ? AND password = ?";
            conexion.query(comandoLog, [nombre, password], async (err, resultados) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (resultados.length > 0) {
                    res.status(200).json({ 
                        message: "Login exitoso",
                        user: resultados[0]
                    });
                } else {
                    res.status(401).json({ error: "Credenciales incorrectas" });
                }
            });
        });
    },

    //funcion para obtener usuarios
    getUsers(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let findUserQuery = "SELECT * FROM admin";
            conexion.query(findUserQuery, async (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para actualizar usuario
    updateUser(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { id, nombre, password, email } = req.body;
            let updateQuery = "UPDATE admin SET nombre = ?, password = ?, email = ? WHERE id = ?";
            let updateValues = [nombre, password, email, id];
            conexion.query(updateQuery, updateValues, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    }
};

module.exports = adminController;
