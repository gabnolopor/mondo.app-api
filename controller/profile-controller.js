const { conexion, ensureConnection } = require("../database");

const profileController = {
    //funcion para obtener el perfil de un usuario
    getProfile(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { phone_number } = req.params;
            let comandoGet = "SELECT * FROM clients WHERE phone = ?";
            conexion.query(comandoGet, [phone_number], (error, results) => {
                if (error) {
                    res.status(500).json({ error: error.message });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ error: 'Profile not found' });
                    return;
                }
                res.json(results[0]);
            });
        });
    }
};

module.exports = profileController;
