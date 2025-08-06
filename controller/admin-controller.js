const { conexion, ensureConnection } = require("../database");
const bcrypt = require('bcrypt');

const adminController = {
    //funcion para verificar el usuario
    async checkUsuario(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let nombre = req.query.nombre;
            let contrasena = req.query.contrasena;

            console.log(`Login attempt: ${nombre}`);

            let comandoLog = "SELECT * FROM admin WHERE nombre = ?";

            conexion.query(comandoLog, [nombre], async (err, resultados) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                if (resultados.length === 0) {
                    return res.json([]); // User not found
                }
                const user = resultados[0];
                
                // Check if the password is hashed
                if (user.contrasena.startsWith('$2b$')) {
                    // Password is hashed, use bcrypt to compare
                    const match = await bcrypt.compare(contrasena, user.contrasena);
                    if (match) {
                        res.json([user]);
                    } else {
                        res.json([]); // Invalid password
                    }
                } else {
                    // Password is not hashed, compare directly (temporary, for transition)
                    if (contrasena === user.contrasena) {
                        res.json([user]);
                    } else {
                        res.json([]); // Invalid password
                    }
                }
            });
        });
    },

    //funcion para actualizar el usuario
    async updateUser(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { newUsername, newPassword, currentPassword } = req.body;

            console.log('Received update request:', { newUsername, newPassword: newPassword ? '[REDACTED]' : undefined, currentPassword: '[REDACTED]' });

            if (!currentPassword) {
                return res.status(400).json({ error: "Current password is required" });
            }

            // Find user by password
            let findUserQuery = "SELECT * FROM admin";
            conexion.query(findUserQuery, async (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                console.log(`Found ${results.length} users in total`);

                // Find user with matching password (hashed or not)
                const user = await findUserByPassword(results, currentPassword);

                if (!user) {
                    console.log('No user found with the provided password');
                    return res.status(401).json({ error: "Invalid credentials" });
                }

                console.log('User found:', { nombre: user.nombre });

                // User found, proceed with update
                let updateQuery = "UPDATE admin SET ";
                let updateValues = [];

                if (newUsername && newUsername !== user.nombre) {
                    updateQuery += "nombre = ?, ";
                    updateValues.push(newUsername);
                }

                if (newPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);
                    updateQuery += "contrasena = ?, ";
                    updateValues.push(hash);
                }

                if (updateValues.length === 0) {
                    console.log('No new values to update');
                    return res.status(400).json({ error: "No updates provided" });
                }

                updateQuery = updateQuery.slice(0, -2);
                updateQuery += " WHERE nombre = ?";
                updateValues.push(user.nombre);

                console.log('Update query:', updateQuery);
                console.log('Update values:', updateValues.map(v => v === user.nombre ? v : '[REDACTED]'));

                conexion.query(updateQuery, updateValues, (err, result) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    console.log('Update result:', result);

                    if (result.affectedRows > 0) {
                        res.json({ message: "User updated successfully", newUsername: newUsername || user.nombre });
                    } else {
                        console.error('No rows affected. Query:', updateQuery, 'Values:', updateValues.map(v => v === user.nombre ? v : '[REDACTED]'));
                        res.status(400).json({ error: "No changes were made" });
                    }
                });
            });
        });
    }
};

//funcion para encontrar el usuario por la contraseña no repetible
async function findUserByPassword(users, password) {
    for (let user of users) {
        let match = false;
        if (user.contrasena.startsWith('$2b$')) {
            // Password is hashed
            match = await bcrypt.compare(password, user.contrasena);
        } else {
            // Password is not hashed
            match = password === user.contrasena;
        }
        if (match) {
            console.log(`Matched user: ${user.nombre}`);
            return { nombre: user.nombre, contrasena: user.contrasena };
        }
    }
    console.log('No user matched the provided password');
    return null;
}

module.exports = adminController;
