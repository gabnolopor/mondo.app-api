const { conexion, ensureConnection } = require("../database");

const { v4: uuidv4 } = require('uuid');

const qrController = {
    // Función para generar un nuevo vale QR
    generateVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { serviceName, expiresAt, notes, createdBy } = req.body;

            const voucherCode = uuidv4();
            const expirationDate = expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto

            const query = `
                INSERT INTO qr_vouchers (voucher_code, service_name, expires_at, notes, created_by) 
                VALUES (?, ?, ?, ?, ?)
            `;

            conexion.query(query, [voucherCode, serviceName || null, expirationDate, notes, createdBy], (err, result) => {
                if (err) {
                    console.error("Error al generar el vale QR:", err);
                    return res.status(500).json({ error: "Error al generar el vale QR" });
                }

                res.status(201).json({
                    message: "Vale QR generado correctamente",
                    voucher: {
                        voucher_id: result.insertId,
                        voucher_code: voucherCode,
                        service_name: serviceName || null,
                        status: 'active',
                        expires_at: expirationDate,
                        notes: notes
                    }
                });
            });
        });
    },

    // Función para obtener todos los vales
    getVouchers(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const query = `
                SELECT voucher_id, voucher_code, service_name, status, created_at, used_at, expires_at, notes, created_by
                FROM qr_vouchers 
                ORDER BY created_at DESC
            `;

            conexion.query(query, (err, results) => {
                if (err) {
                    console.error("Error al obtener los vales:", err);
                    return res.status(500).json({ error: "Error al obtener los vales" });
                }

                res.status(200).json(results);
            });
        });
    },

    // Función para obtener un vale por código
    getVoucherByCode(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { voucherCode } = req.params;

            const query = `
                SELECT voucher_id, voucher_code, service_name, status, created_at, used_at, expires_at, notes, created_by
                FROM qr_vouchers 
                WHERE voucher_code = ?
            `;

            conexion.query(query, [voucherCode], (err, results) => {
                if (err) {
                    console.error("Error al obtener el vale:", err);
                    return res.status(500).json({ error: "Error al obtener el vale" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Vale no encontrado" });
                }

                res.status(200).json(results[0]);
            });
        });
    },

    // Función para redimir un vale
    redeemVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { voucherCode } = req.body;

            if (!voucherCode) {
                return res.status(400).json({ error: "Código del vale es requerido" });
            }

            // Primero verificar si el vale existe y su estado
            const checkQuery = `
                SELECT voucher_id, service_name, status, expires_at
                FROM qr_vouchers 
                WHERE voucher_code = ?
            `;

            conexion.query(checkQuery, [voucherCode], (err, results) => {
                if (err) {
                    console.error("Error al verificar el vale:", err);
                    return res.status(500).json({ error: "Error al verificar el vale" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Vale no encontrado" });
                }

                const voucher = results[0];

                // Verificar si ya fue usado
                if (voucher.status === 'used') {
                    return res.status(400).json({ error: "Este vale ya ha sido utilizado" });
                }

                // Verificar si ha expirado
                if (voucher.status === 'expired' || (voucher.expires_at && new Date() > new Date(voucher.expires_at))) {
                    // Actualizar estado a expirado si no lo está
                    if (voucher.status !== 'expired') {
                        const updateExpiredQuery = "UPDATE qr_vouchers SET status = 'expired' WHERE voucher_id = ?";
                        conexion.query(updateExpiredQuery, [voucher.voucher_id]);
                    }
                    return res.status(400).json({ error: "Este vale ha expirado" });
                }

                // Marcar como usado
                const redeemQuery = `
                    UPDATE qr_vouchers 
                    SET status = 'used', used_at = NOW() 
                    WHERE voucher_id = ?
                `;

                conexion.query(redeemQuery, [voucher.voucher_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error("Error al redimir el vale:", updateErr);
                        return res.status(500).json({ error: "Error al redimir el vale" });
                    }

                    res.status(200).json({
                        message: "Vale redimido correctamente",
                        service_name: voucher.service_name,
                        voucher_id: voucher.voucher_id
                    });
                });
            });
        });
    },

    // Función para actualizar un vale
    updateVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { voucher_id, service_name, expires_at, notes, status } = req.body;

            if (!voucher_id) {
                return res.status(400).json({ error: "ID del vale es requerido" });
            }

            const query = `
                UPDATE qr_vouchers 
                SET service_name = ?, expires_at = ?, notes = ?, status = ?
                WHERE voucher_id = ?
            `;

            conexion.query(query, [service_name, expires_at, notes, status, voucher_id], (err, result) => {
                if (err) {
                    console.error("Error al actualizar el vale:", err);
                    return res.status(500).json({ error: "Error al actualizar el vale" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Vale no encontrado" });
                }

                res.status(200).json({ message: "Vale actualizado correctamente" });
            });
        });
    },

    // Función para eliminar un vale
    deleteVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const { voucherId } = req.params;

            if (!voucherId) {
                return res.status(400).json({ error: "ID del vale es requerido" });
            }

            const query = "DELETE FROM qr_vouchers WHERE voucher_id = ?";

            conexion.query(query, [voucherId], (err, result) => {
                if (err) {
                    console.error("Error al eliminar el vale:", err);
                    return res.status(500).json({ error: "Error al eliminar el vale" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "Vale no encontrado" });
                }

                res.status(200).json({ message: "Vale eliminado correctamente" });
            });
        });
    },

    // Función para obtener estadísticas de vales
    getVoucherStats(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            const query = `
                SELECT 
                    COUNT(*) as total_vouchers,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_vouchers,
                    COUNT(CASE WHEN status = 'used' THEN 1 END) as used_vouchers,
                    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_vouchers
                FROM qr_vouchers
            `;

            conexion.query(query, (err, results) => {
                if (err) {
                    console.error("Error al obtener estadísticas:", err);
                    return res.status(500).json({ error: "Error al obtener estadísticas" });
                }

                res.status(200).json(results[0]);
            });
        });
    }
};

module.exports = qrController; 