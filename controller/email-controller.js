const nodemailer = require("nodemailer");

const QRcode = require("qrcode");

// Configurar el transporter de Nodemailer
const createTransporter = () => {
  // Verificar si las variables de entorno están configuradas
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Variables de entorno de email no configuradas:");
    console.warn(
      "   EMAIL_USER:",
      process.env.EMAIL_USER ? "Configurado" : "No configurado"
    );
    console.warn(
      "   EMAIL_PASS:",
      process.env.EMAIL_PASS ? "Configurado" : "No configurado"
    );
    return null;
  }

  console.log(
    "✅ Configurando transporter de email con:",
    process.env.EMAIL_USER
  );

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Función para generar el HTML del email
const generateEmailHTML = async (bookingData, qrCode) => {
  const {
    customerName,
    serviceName,
    serviceVariant,
    appointmentDate,
    totalAmount,
  } = bookingData;

  const formattedDate = new Date(appointmentDate).toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generar QR gráfico
  let qrImageData = "";
  try {
    qrImageData = await QRcode.toDataURL(qrCode, {
      width: 200,
      margin: 2,
      color: {
        dark: "#B898B0",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    // Fallback a texto si falla la generación del QR
    qrImageData = "";
  }

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
                .qr-image {
                    margin: 20px 0;
                    padding: 20px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
                    <h3>�� Tu Código QR</h3>
                    <p>Presenta este código QR en el local para canjear tu servicio:</p>
                    
                    ${
                      qrImageData
                        ? `
                        <div class="qr-image">
                            <img src="${qrImageData}" alt="Código QR" style="max-width: 200px; height: auto;" />
                        </div>
                    `
                        : `
                        <div class="qr-code">${qrCode}</div>
                    `
                    }
                    
                    <p><strong>⚠️ Importante:</strong> Este código es único y solo se puede usar una vez.</p>
                </div>

                <div class="important">
                    <h4>�� Instrucciones:</h4>
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
                    <p>Email: <a href="mailto:vpp.mondo@gmail.com">vpp.mondo@gmail.com</a></p>
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

// Función para generar el HTML del email de productos
const generateProductOrderHTML = (orderData) => {
  const { customerName, orderItems, totalAmount, qrCode } = orderData;

  const itemsHTML = orderItems
    .map(
      (item) => `
        <div class="detail-row">
            <span class="detail-label">${item.name}</span>
            <span class="detail-value">${item.quantity} x €${item.price} + IVA (21%) = €${totalAmount}</span>
        </div>
    `
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Pedido - MONDO</title>
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
                .order-details {
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
                .total-section {
                    background-color: #e3f2fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .total-amount {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #1976d2;
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
                    background-color: #fff;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    display: inline-block;
                    margin: 10px 0;
                }
                .contact-info {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MONDO</div>
                    <h1>✅ Pedido Confirmado</h1>
                </div>

                <p>Hola <strong>${customerName}</strong>,</p>
                <p>Tu pedido ha sido procesado exitosamente. Aquí tienes los detalles:</p>

                <div class="order-details">
                    <h3>📦 Productos del Pedido:</h3>
                    ${itemsHTML}
                </div>

                <div class="total-section">
                    <h3>💰 Total del Pedido:</h3>
                    <div class="total-amount">€${totalAmount}</div>
                </div>

                <div class="qr-section">
                    <h3>🔍 Código de Seguimiento:</h3>
                    <div class="qr-code">${qrCode}</div>
                    <p><small>Guarda este código para consultar el estado de tu pedido</small></p>
                </div>

                <div class="contact-info">
                    <h3>📞 Información de Contacto</h3>
                    <p>Si tienes alguna pregunta sobre tu pedido:</p>
                    <p>Email: <a href="mailto:vpp.mondo@gmail.com">vpp.mondo@gmail.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/34603132929">+34 603 132 929</a></p>
                </div>

                <div class="footer">
                    <p>Gracias por tu compra en MONDO</p>
                    <p>Para cualquier consulta, no dudes en contactarnos</p>
                    <p>© ${new Date().getFullYear()} MONDO - Todos los derechos reservados</p>
                </div>  
            </div>
        </body>
        </html>
    `;
};

// Función para generar HTML del email de alerta de pedido de productos
const generateProductOrderAlertHTML = (orderData) => {
  const { 
    customerName, 
    customerEmail, 
    customerPhone, 
    customerAddress, 
    orderItems, 
    subtotal, 
    ivaAmount, 
    shippingCost, 
    totalAmount, 
    qrCode, 
    orderId 
  } = orderData;

  const itemsHTML = orderItems
    .map(
      (item) => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong><br>
                <small>Cantidad: ${item.quantity} x €${item.price}</small>
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
                €${(item.price * item.quantity).toFixed(2)}
            </td>
        </tr>
    `
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Pedido de Productos - MONDO</title>
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
                .alert-badge {
                    background-color: #28a745;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 0.9em;
                    display: inline-block;
                    margin-bottom: 20px;
                }
                .customer-info {
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
                .products-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .products-table th,
                .products-table td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .products-table th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                }
                .total-section {
                    background-color: #e3f2fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .total-amount {
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #1976d2;
                }
                .qr-section {
                    text-align: center;
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #fff3cd;
                    border-radius: 8px;
                    border: 2px solid #ffc107;
                }
                .qr-code {
                    font-family: monospace;
                    font-size: 1.1em;
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ddd;
                    display: inline-block;
                    margin: 10px 0;
                }
                .contact-info {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MONDO</div>
                    <h2>🛒 Nuevo Pedido de Productos</h2>
                    <div class="alert-badge">✅ PAGADO</div>
                </div>

                <div class="customer-info">
                    <h3>👤 Información del Cliente</h3>
                    <div class="detail-row">
                        <span class="detail-label">Nombre:</span>
                        <span class="detail-value">${customerName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${customerEmail}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Teléfono:</span>
                        <span class="detail-value">${customerPhone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Dirección:</span>
                        <span class="detail-value">${customerAddress}</span>
                    </div>
                </div>

                <div class="products-section">
                    <h3>📦 Productos del Pedido</h3>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th style="text-align: right;">Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                    </table>
                </div>

                <div class="total-section">
                    <h3>💰 Desglose del Pedido</h3>
                    <div class="detail-row">
                        <span class="detail-label">Subtotal:</span>
                        <span class="detail-value">€${parseFloat(subtotal).toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">IVA (21%):</span>
                        <span class="detail-value">€${parseFloat(ivaAmount).toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Envío:</span>
                        <span class="detail-value">€${parseFloat(shippingCost).toFixed(2)}</span>
                    </div>
                    <div class="detail-row" style="border-bottom: none; font-weight: bold;">
                        <span class="detail-label">Total:</span>
                        <span class="detail-value total-amount">€${parseFloat(totalAmount).toFixed(2)}</span>
                    </div>
                </div>

                <div class="qr-section">
                    <h3>🔍 Código de Seguimiento</h3>
                    <div class="qr-code">${qrCode}</div>
                    <p><small>ID del Pedido: #${orderId}</small></p>
                </div>

                <div class="contact-info">
                    <h3>📱 Contacto Directo del Cliente</h3>
                    <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
                    <p><strong>Teléfono:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/${customerPhone.replace(/\D/g, '')}">${customerPhone}</a></p>
                </div>

                <div class="footer">
                    <p>Este pedido fue procesado automáticamente desde la web</p>
                    <p>© ${new Date().getFullYear()} MONDO - Todos los derechos reservados</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Función para enviar email de alerta de pedido de productos a vpp.mondo
const sendProductOrderAlert = async (orderData) => {
  try {
    console.log(
      "📧 Enviando email de alerta de pedido de productos a vpp.mondo@gmail.com"
    );

    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return { success: false, error: "Email no configurado" };
    }

    const mailOptions = {
      from: `"MONDO" <${process.env.EMAIL_USER}>`,
      to: "vpp.mondo@gmail.com",
      subject: `🛒 Nuevo Pedido de Productos - ${orderData.customerName}`,
      html: generateProductOrderAlertHTML(orderData),
    };

    console.log("📧 Enviando email de alerta con opciones:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Email de alerta de pedido de productos enviado exitosamente:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "❌ Error enviando email de alerta de pedido de productos:",
      error
    );
    console.error("❌ Detalles del error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    return { success: false, error: error.message };
  }
};

// Función para generar HTML del email de contacto
const generateContactHTML = (data) => {
  const { name, email, phone, message, service } = data;
  
  const serviceName = service ? `(${service})` : '(No especificado)';

  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nueva Consulta de Contacto - MONDO</title>
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
                .contact-info {
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
                .message-box {
                    background-color: #e3f2fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #1976d2;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">MONDO</div>
                    <h2>📧 Nueva Consulta de Contacto</h2>
                </div>

                <div class="contact-info">
                    <h3>👤 Información del Cliente</h3>
                    <div class="detail-row">
                        <span class="detail-label">Nombre:</span>
                        <span class="detail-value">${name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Teléfono:</span>
                        <span class="detail-value">${phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Servicio de Interés:</span>
                        <span class="detail-value">${serviceName}</span>
                    </div>
                </div>

                <div class="message-box">
                    <h3>💬 Mensaje del Cliente</h3>
                    <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                </div>

                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7; margin: 20px 0;">
                    <p><strong>📱 Contacto Directo:</strong></p>
                    <p>• <strong>Email:</strong> ${email}</p>
                    <p>• <strong>Teléfono:</strong> ${phone}</p>
                </div>

                <div class="footer">
                    <p>Esta consulta fue enviada desde el formulario de contacto de la web</p>
                    <p>© ${new Date().getFullYear()} MONDO - Todos los derechos reservados</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Función para generar HTML del email de consulta
const generateInquiryHTML = (data) => {
  const formatItems = (items) => {
    return items
      .map(
        (item) => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong><br>
                    <small>Cantidad: ${item.quantity} x €${item.price}</small>
                </td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
                    €${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `
      )
      .join("");
  };

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Consulta sobre Pedido #${data.orderId}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #B898B0; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
                .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #B898B0; }
                .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
                .table th { background-color: #f5f5f5; font-weight: bold; }
                .highlight { background-color: #fff3cd; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1> Consulta sobre Pedido</h1>
                    <p>MONDO - Cliente solicita información</p>
                </div>
                
                <div class="content">
                    <div class="info-box">
                        <h3> Información del Cliente</h3>
                        <p><strong>Nombre:</strong> ${data.customerName}</p>
                        <p><strong>Email:</strong> ${data.customerEmail}</p>
                        <p><strong>Teléfono:</strong> ${data.customerPhone}</p>
                    </div>

                    <div class="info-box">
                        <h3>📦 Detalles del Pedido</h3>
                        <p><strong>Número de Pedido:</strong> #${
                          data.orderId
                        }</p>
                        <p><strong>Código de Seguimiento:</strong> <code>${
                          data.trackingCode
                        }</code></p>
                        <p><strong>Estado Actual:</strong> ${
                          data.orderStatus
                        }</p>
                        <p><strong>Monto Total:</strong> €${
                          data.totalAmount
                        }</p>
                    </div>

                    <div class="info-box">
                        <h3>️ Productos del Pedido</h3>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th style="text-align: right;">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${formatItems(data.orderItems)}
                            </tbody>
                        </table>
                    </div>

                    <div class="highlight">
                        <p><strong>💬 El cliente ha solicitado información sobre este pedido.</strong></p>
                        <p>Por favor, contacta con ${
                          data.customerName
                        } lo antes posible para resolver su consulta.</p>
                    </div>

                    <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px; border: 1px solid #c3e6c3;">
                        <p><strong>📱 Contacto Directo:</strong></p>
                        <p>• <strong>Email:</strong> ${data.customerEmail}</p>
                        <p>• <strong>Teléfono:</strong> ${
                          data.customerPhone
                        }</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Función para enviar email de contacto
const sendContactEmail = async (req, res) => {
  const { name, email, phone, message, service } = req.body;

  console.log("📧 Enviando email de contacto de:", name);

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return res.status(500).json({
        success: false,
        error: "Email no configurado",
      });
    }

    // Generar HTML del email
    const htmlContent = generateContactHTML({
      name,
      email,
      phone,
      message,
      service,
    });

    // Configurar opciones del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "vpp.mondo@gmail.com", // Email de Mondo
      subject: `📧 Nueva Consulta de Contacto - ${name}`,
      html: htmlContent,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Email de contacto enviado exitosamente a vpp.mondo@gmail.com"
    );

    res.json({
      success: true,
      message: "Email enviado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error enviando email de contacto:", error);
    res.status(500).json({
      success: false,
      error: "Error enviando email",
    });
  }
};

// Función para enviar email de consulta sobre pedido
const sendInquiryEmail = async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    trackingCode,
    orderId,
    orderStatus,
    orderItems,
    totalAmount,
  } = req.body;

  console.log("📧 Enviando email de consulta para pedido:", orderId);

  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return res.status(500).json({
        success: false,
        error: "Email no configurado",
      });
    }

    // Generar HTML del email
    const htmlContent = generateInquiryHTML({
      customerName,
      customerEmail,
      customerPhone,
      trackingCode,
      orderId,
      orderStatus,
      orderItems,
      totalAmount,
    });

    // Configurar opciones del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "vpp.mondo@gmail.com", // Email de Mondo
      subject: `Consulta sobre Pedido #${orderId} - ${customerName}`,
      html: htmlContent,
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Email de consulta enviado exitosamente a vpp.mondo@gmail.com"
    );

    res.json({
      success: true,
      message: "Email enviado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error enviando email de consulta:", error);
    res.status(500).json({
      success: false,
      error: "Error enviando email",
    });
  }
};

// Función para enviar email de confirmación de pedido de productos
const sendProductOrderConfirmation = async (orderData) => {
  try {
    console.log(
      "📧 Intentando enviar email de confirmación de producto a:",
      orderData.customerEmail
    );

    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return { success: false, error: "Email no configurado" };
    }

    const mailOptions = {
      from: `"MONDO" <${process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `✅ Confirmación de Pedido - MONDO`,
      html: generateProductOrderHTML(orderData),
    };

    console.log("📧 Enviando email de producto con opciones:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "✅ Email de confirmación de producto enviado exitosamente:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      "❌ Error enviando email de confirmación de producto:",
      error
    );
    console.error("❌ Detalles del error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    return { success: false, error: error.message };
  }
};

// Función para enviar email de confirmación
const sendBookingConfirmation = async (bookingData, qrCode) => {
  try {
    console.log(
      "📧 Intentando enviar email de confirmación a:",
      bookingData.customerEmail
    );

    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return { success: false, error: "Email no configurado" };
    }

    const htmlContent = await generateEmailHTML(bookingData, qrCode);

    const mailOptions = {
      from: `"MONDO" <${process.env.EMAIL_USER}>`,
      to: bookingData.customerEmail,
      subject: `✅ Confirmación de Reserva - ${bookingData.serviceName}`,
      html: htmlContent,
    };
    const mailAlert = {
      from: `"MONDO" <${process.env.EMAIL_USER}>`,
      to: "vpp.mondo@gmail.com",
      subject: `✅ Confirmación de Reserva - ${bookingData.serviceName}`,
      html: `
                <h2>Hola Wendy!</h2>
                <p>Te recordamos que tienes una nueva cita</p>
                <p><strong>Nombre:</strong> ${bookingData.customerName}</p>
                <p><strong>Servicio:</strong> ${bookingData.serviceName}</p>
                <p><strong>Fecha:</strong> ${new Date(
                  bookingData.appointmentDate
                ).toLocaleDateString("es-ES")}</p>
                <p><strong>Hora:</strong> ${new Date(
                  bookingData.appointmentDate
                ).toLocaleTimeString("es-ES")}</p>
                <p><strong>Teléfono:</strong> ${bookingData.customerPhone}</p>
                <p><strong>Email:</strong> ${bookingData.customerEmail}</p>
            `,
    };
    console.log("📧 Enviando email con opciones:", {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
    });

    const info = await transporter.sendMail(mailOptions);
    const infoAlert = await transporter.sendMail(mailAlert);

    console.log(
      "✅ Email de confirmación enviado exitosamente:",
      info.messageId
    );
    console.log(
      "✅ Email de alerta enviado exitosamente:",
      infoAlert.messageId
    );
    return {
      success: true,
      messageId: info.messageId,
      infoAlert: infoAlert.messageId,
    };
  } catch (error) {
    console.error("❌ Error enviando email de confirmación:", error);
    console.error("❌ Detalles del error:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    return { success: false, error: error.message };
  }
};

// Función para enviar email de recordatorio (opcional)
const sendBookingReminder = async (bookingData) => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error("❌ No se pudo crear el transporter de email");
      return { success: false, error: "Email no configurado" };
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
                <p><strong>Fecha:</strong> ${new Date(
                  bookingData.appointmentDate
                ).toLocaleDateString("es-ES")}</p>
                <p>¡Te esperamos!</p>
            </body>
            </html>
        `;

    const mailOptions = {
      from: `"MONDO" <${process.env.EMAIL_USER}>`,
      to: bookingData.customerEmail,
      subject: `📅 Recordatorio de Cita - ${bookingData.serviceName}`,
      html: reminderHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email de recordatorio enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error enviando recordatorio:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingReminder,
  sendProductOrderConfirmation,
  sendProductOrderAlert,
  sendInquiryEmail,
  sendContactEmail,
  generateInquiryHTML,
  generateContactHTML,
};
