const { conexion, ensureConnection } = require("../database");

const qrController = {
    //funcion para crear un voucher QR
    createVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { voucherCode, serviceName, expirationDate, notes, createdBy } = req.body;
            let query = "INSERT INTO qr_vouchers (voucher_code, service_name, expires_at, notes, created_by, status) VALUES (?, ?, ?, ?, ?, 'active')";
            conexion.query(query, [voucherCode, serviceName || null, expirationDate, notes, createdBy], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: result.insertId, voucher_code: voucherCode });
            });
        });
    },

    //funcion para obtener todos los vouchers
    getAllVouchers(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let query = "SELECT * FROM qr_vouchers ORDER BY created_at DESC";
            conexion.query(query, (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    },

    //funcion para obtener un voucher por código
    getVoucherByCode(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { voucherCode } = req.params;
            let query = "SELECT * FROM qr_vouchers WHERE voucher_code = ?";
            conexion.query(query, [voucherCode], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ error: 'Voucher not found' });
                    return;
                }
                res.json(results[0]);
            });
        });
    },

    //funcion para validar un voucher
    validateVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { voucherCode } = req.params;
            let checkQuery = "SELECT * FROM qr_vouchers WHERE voucher_code = ? AND status = 'active'";
            conexion.query(checkQuery, [voucherCode], (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (results.length === 0) {
                    res.status(404).json({ error: 'Voucher not found or already used' });
                    return;
                }
                
                let voucher = results[0];
                let now = new Date();
                let expirationDate = new Date(voucher.expires_at);
                
                if (now > expirationDate) {
                    // Marcar como expirado
                    let updateExpiredQuery = "UPDATE qr_vouchers SET status = 'expired' WHERE voucher_id = ?";
                    conexion.query(updateExpiredQuery, [voucher.voucher_id]);
                    res.status(400).json({ error: 'Voucher has expired' });
                    return;
                }
                
                // Marcar como usado
                let redeemQuery = "UPDATE qr_vouchers SET status = 'used', used_at = NOW() WHERE voucher_id = ?";
                conexion.query(redeemQuery, [voucher.voucher_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        res.status(500).json({ error: updateErr.message });
                        return;
                    }
                    res.json({ 
                        message: 'Voucher validated successfully',
                        voucher: voucher
                    });
                });
            });
        });
    },

    //funcion para actualizar un voucher
    updateVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { voucherId } = req.params;
            let { service_name, expires_at, notes, status } = req.body;
            let query = "UPDATE qr_vouchers SET service_name = ?, expires_at = ?, notes = ?, status = ? WHERE voucher_id = ?";
            conexion.query(query, [service_name, expires_at, notes, status, voucherId], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para eliminar un voucher
    deleteVoucher(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let { voucherId } = req.params;
            let query = "DELETE FROM qr_vouchers WHERE voucher_id = ?";
            conexion.query(query, [voucherId], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.sendStatus(200);
            });
        });
    },

    //funcion para obtener estadísticas de vouchers
    getVoucherStats(req, res) {
        ensureConnection((err) => {
            if (err) {
                return res.status(500).json({ error: 'Database connection failed' });
            }
            
            let query = "SELECT status, COUNT(*) as count FROM qr_vouchers GROUP BY status";
            conexion.query(query, (err, results) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(results);
            });
        });
    }
};

module.exports = qrController; 