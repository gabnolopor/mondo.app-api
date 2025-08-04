const nodemailer = require('nodemailer');

// Configurar el transporter de Nodemailer
const createTransporter = () => {
    // Verificar si las variables de entorno están configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Variables de entorno de email no configuradas:');
        console.warn('   EMAIL_USER:', process.env.EMAIL_USER ? 'Configurado' : 'No configurado');
        console.warn('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Configurado' : 'No configurado');
        return null;
    }

    console.log('✅ Configurando transporter de email con:', process.env.EMAIL_USER);
    
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Función para generar el HTML del email
const generateEmailHTML = (bookingData, qrCode) => {
    const { customerName, serviceName, serviceVariant, appointmentDate, totalAmount } = bookingData;
    
    const formattedDate = new Date(appointmentDate).toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Reserva - MONDO</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .container {
                    background-color: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    color: #B898B0;
                }
                .logo {
                    font-size: 2.5em;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .booking-details {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .detail-label {
                    font-weight: bold;
                    color: #666;
                }
                .detail-value {
                    color: #333;
                }
                .qr-section {
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background-color: #fff3cd;
                    border-radius: 8px;
                    border: 2px solid #ffc107;
                }
                .qr-code {
                    font-family: monospace;
                    font-size: 1.2em;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 10px 0;
                    word-break: break-all;
                }
                .important {
                    background-color: #d1ecf1;
                    border: 1px solid #bee5eb;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 0.9em;
                }
                .contact-info {
                    background-color: #e2e3e5;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MONDO</div>
                    <h2>✅ Confirmación de Reserva</h2>
                </div>

                <p>Hola <strong>${customerName}</strong>,</p>
                
                <p>Tu reserva ha sido confirmada y pagada exitosamente. Aquí tienes todos los detalles:</p>

                <div class="booking-details">
                    <div class="detail-row">
                        <span class="detail-label">Servicio:</span>
                        <span class="detail-value">${serviceName} (${serviceVariant})</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fecha y Hora:</span>
                        <span class="detail-value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Pagado:</span>
                        <span class="detail-value">€${totalAmount}</span>
                    </div>
                </div>

                <div class="qr-section">
                    <h3>🎫 Tu Código QR</h3>
                    <p>Presenta este código QR en el local para canjear tu servicio:</p>
                    <div class="qr-code">${qrCode}</div>
                    <p><strong>⚠️ Importante:</strong> Este código es único y solo se puede usar una vez.</p>
                </div>

                <div class="important">
                    <h4>📋 Instrucciones:</h4>
                    <ul>
                        <li>Llega 10 minutos antes de tu cita</li>
                        <li>Presenta este email o el código QR</li>
                        <li>El código se invalidará después de su uso</li>
                        <li>No compartas este código con nadie</li>
                    </ul>
                </div>

                <div class="contact-info">
                    <h4>📍 Ubicación:</h4>
                    <p>Doctor Caro Romero #7</p>
                    <h4>📞 Contacto: +34 603132929</h4>
                    <p>WhatsApp: <a href="https://wa.me/34603132929">+34 603 132 929</a></p>
                </div>

                <div class="footer">
                    <p>Gracias por elegir MONDO</p>
                    <p>Para cualquier consulta, no dudes en contactarnos</p>
                    <p>© ${new Date().getFullYear()} MONDO - Todos los derechos reservados</p>
                </div>  
            </div>
        </body>
        </html>
    `;
};

// Función para enviar email de confirmación
const sendBookingConfirmation = async (bookingData, qrCode) => {
    try {
        console.log('📧 Intentando enviar email de confirmación a:', bookingData.customerEmail);
        
        const transporter = createTransporter();
        
        if (!transporter) {
            console.error('❌ No se pudo crear el transporter de email');
            return { success: false, error: 'Email no configurado' };
        }

        const mailOptions = {
            from: `"MONDO" <${process.env.EMAIL_USER}>`,
            to: bookingData.customerEmail,
            subject: `✅ Confirmación de Reserva - ${bookingData.serviceName}`,
            html: generateEmailHTML(bookingData, qrCode)
        };

        console.log('📧 Enviando email con opciones:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            from: mailOptions.from
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de confirmación enviado exitosamente:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error enviando email de confirmación:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            code: error.code,
            command: error.command
        });
        return { success: false, error: error.message };
    }
};

// Función para enviar email de recordatorio (opcional)
const sendBookingReminder = async (bookingData) => {
    try {
        const transporter = createTransporter();
        
        if (!transporter) {
            console.error('❌ No se pudo crear el transporter de email');
            return { success: false, error: 'Email no configurado' };
        }
        
        const reminderHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Recordatorio de Cita - MONDO</title>
            </head>
            <body>
                <h2>Hola ${bookingData.customerName},</h2>
                <p>Te recordamos que tienes una cita mañana:</p>
                <p><strong>Servicio:</strong> ${bookingData.serviceName}</p>
                <p><strong>Fecha:</strong> ${new Date(bookingData.appointmentDate).toLocaleDateString('es-ES')}</p>
                <p>¡Te esperamos!</p>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"MONDO" <${process.env.EMAIL_USER}>`,
            to: bookingData.customerEmail,
            subject: `📅 Recordatorio de Cita - ${bookingData.serviceName}`,
            html: reminderHTML
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de recordatorio enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error enviando recordatorio:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendBookingConfirmation,
    sendBookingReminder
}; 