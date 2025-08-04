const conexion = require('../database');
const { v4: uuidv4 } = require('uuid');
const { sendBookingConfirmation } = require('./email-controller');

// Verificar si Stripe está configurado
let stripe;
let stripeConfigured = false;

try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === '') {
        console.warn('⚠️ STRIPE_SECRET_KEY no está configurada. Usando modo de prueba.');
        stripe = null;
        stripeConfigured = false;
    } else {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        // Verificar que la clave sea válida
        stripe.customers.list({ limit: 1 }).then(() => {
            console.log('✅ Stripe configurado correctamente');
            stripeConfigured = true;
        }).catch((error) => {
            console.warn('⚠️ STRIPE_SECRET_KEY inválida:', error.message);
            console.warn('⚠️ Usando modo de prueba.');
            stripe = null;
            stripeConfigured = false;
        });
    }
} catch (error) {
    console.error('Error inicializando Stripe:', error);
    console.warn('⚠️ Usando modo de prueba debido a error en configuración de Stripe.');
    stripe = null;
    stripeConfigured = false;
}

const paymentsController = {
    // Función para crear sesión de pago con Stripe
    async createPaymentSession(req, res) {
        const {
            customerName,
            customerEmail,
            customerPhone,
            serviceType,
            serviceId,
            serviceVariant,
            appointmentDate,
            totalAmount,
            serviceName
        } = req.body;

        console.log('🔧 Creando sesión de pago:', {
            customerName,
            serviceName,
            serviceVariant,
            totalAmount,
            stripeConfigured
        });

        // Si Stripe no está configurado o es inválido, crear una sesión de prueba
        if (!stripe || !stripeConfigured) {
            console.log('🔧 Creando sesión de prueba (Stripe no configurado o inválido)');

            // Generar QR único para la prueba
            const qrCode = uuidv4();

            // Guardar reserva pagada directamente en modo prueba
            const query = `
                INSERT INTO paid_bookings
                (customer_name, customer_email, customer_phone, service_type, service_id,
                 service_variant, appointment_date, total_amount, stripe_payment_id, qr_code, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
            `;

            conexion.query(query, [
                customerName,
                customerEmail,
                customerPhone,
                serviceType,
                serviceId,
                serviceVariant,
                appointmentDate,
                totalAmount,
                'pi_test_' + uuidv4().substring(0, 24),
                qrCode
            ], async (err, result) => {
                if (err) {
                    console.error('Error saving test booking:', err);
                    return res.status(500).json({ error: 'Error saving test booking' });
                }

                console.log('✅ Reserva de prueba guardada exitosamente');

                // Enviar email de confirmación
                try {
                    const bookingData = {
                        customerName,
                        customerEmail,
                        serviceName,
                        serviceVariant,
                        appointmentDate,
                        totalAmount
                    };

                    await sendBookingConfirmation(bookingData, qrCode);
                    console.log('✅ Email de confirmación enviado (modo prueba)');
                } catch (emailError) {
                    console.error('❌ Error enviando email (modo prueba):', emailError);
                }

                res.json({
                    sessionId: 'cs_test_' + uuidv4().substring(0, 24),
                    testMode: true,
                    qrCode: qrCode,
                    message: 'Reserva creada en modo prueba (Stripe no configurado o inválido)'
                });
            });
            return;
        }

        try {
            console.log('🔧 Creando sesión de Stripe real');

            // Crear sesión de pago con Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `${serviceName} - ${serviceVariant}`,
                            description: `Cita para ${serviceName} (${serviceVariant}) - ${appointmentDate}`,
                        },
                        unit_amount: Math.round(totalAmount * 100), // Stripe usa centavos
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/?payment=success`,
                cancel_url: `${process.env.CLIENT_URL}/?payment=cancelled`,
                metadata: {
                    customerName,
                    customerEmail,
                    customerPhone,
                    serviceType,
                    serviceId,
                    serviceVariant,
                    appointmentDate,
                    totalAmount,
                    serviceName
                }
            });

            console.log('✅ Sesión de Stripe creada:', session.id);

            if (!session.id) {
                throw new Error('No se pudo crear la sesión de Stripe');
            }

            res.json({ sessionId: session.id });
        } catch (error) {
            console.error('Error creating payment session:', error);

            // Si hay error con Stripe, fallback a modo prueba
            if (error.type === 'StripeAuthenticationError' || error.type === 'StripeInvalidRequestError') {
                console.log('🔧 Fallback a modo prueba debido a error de Stripe');

                // Generar QR único para la prueba
                const qrCode = uuidv4();

                // Guardar reserva pagada directamente en modo prueba
                const query = `
                    INSERT INTO paid_bookings
                    (customer_name, customer_email, customer_phone, service_type, service_id,
                     service_variant, appointment_date, total_amount, stripe_payment_id, qr_code, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
                `;

                conexion.query(query, [
                    customerName,
                    customerEmail,
                    customerPhone,
                    serviceType,
                    serviceId,
                    serviceVariant,
                    appointmentDate,
                    totalAmount,
                    'pi_test_' + uuidv4().substring(0, 24),
                    qrCode
                ], async (err, result) => {
                    if (err) {
                        console.error('Error saving test booking:', err);
                        return res.status(500).json({ error: 'Error saving test booking' });
                    }

                    console.log('✅ Reserva de prueba guardada exitosamente (fallback)');

                    // Enviar email de confirmación
                    try {
                        const bookingData = {
                            customerName,
                            customerEmail,
                            serviceName,
                            serviceVariant,
                            appointmentDate,
                            totalAmount
                        };

                        await sendBookingConfirmation(bookingData, qrCode);
                        console.log('✅ Email de confirmación enviado (fallback)');
                    } catch (emailError) {
                        console.error('❌ Error enviando email (fallback):', emailError);
                    }

                    res.json({
                        sessionId: 'cs_test_' + uuidv4().substring(0, 24),
                        testMode: true,
                        qrCode: qrCode,
                        message: 'Reserva creada en modo prueba (fallback por error de Stripe)'
                    });
                });
                return;
            }

            res.status(500).json({ error: 'Error creating payment session: ' + error.message });
        }
    },

    // Función para manejar webhook de Stripe
    handleWebhook(req, res) {
        console.log('🔧 Webhook recibido');
        console.log('🔧 Headers:', req.headers);
        console.log('🔧 Body length:', req.body ? req.body.length : 'No body');

        if (!stripe || !stripeConfigured) {
            console.log('🔧 Webhook ignorado (Stripe no configurado)');
            return res.status(200).json({ received: true, testMode: true });
        }

        const sig = req.headers['stripe-signature'];
        console.log('🔧 Stripe signature:', sig ? 'Presente' : 'Ausente');
        
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            console.log('✅ Webhook verificado:', event.type);
            console.log('🔧 Event data:', JSON.stringify(event.data, null, 2));
        } catch (err) {
            console.error('❌ Webhook signature verification failed:', err.message);
            console.error('❌ Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Configurado' : 'No configurado');
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const metadata = session.metadata;

            console.log('✅ Pago completado:', session.id);
            console.log('🔧 Metadata del pago:', metadata);

            // Generar QR único
            const qrCode = uuidv4();
            console.log('🔧 QR generado:', qrCode);

            // Guardar reserva pagada en la base de datos
            const query = `
                INSERT INTO paid_bookings
                (customer_name, customer_email, customer_phone, service_type, service_id,
                 service_variant, appointment_date, total_amount, stripe_payment_id, qr_code, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')
            `;

            const queryParams = [
                metadata.customerName,
                metadata.customerEmail,
                metadata.customerPhone,
                metadata.serviceType,
                metadata.serviceId,
                metadata.serviceVariant,
                metadata.appointmentDate,
                metadata.totalAmount,
                session.payment_intent,
                qrCode
            ];

            console.log('🔧 Guardando reserva con parámetros:', queryParams);

            conexion.query(query, queryParams, async (err, result) => {
                if (err) {
                    console.error('❌ Error saving paid booking:', err);
                    return res.status(500).json({ error: 'Error saving booking' });
                }

                console.log('✅ Reserva pagada guardada exitosamente en DB');

                // Enviar email de confirmación
                try {
                    const bookingData = {
                        customerName: metadata.customerName,
                        customerEmail: metadata.customerEmail,
                        serviceName: metadata.serviceName,
                        serviceVariant: metadata.serviceVariant,
                        appointmentDate: metadata.appointmentDate,
                        totalAmount: metadata.totalAmount
                    };

                    console.log('📧 Enviando email con datos:', bookingData);
                    
                    const emailResult = await sendBookingConfirmation(bookingData, qrCode);
                    
                    if (emailResult.success) {
                        console.log('✅ Email de confirmación enviado exitosamente');
                    } else {
                        console.error('❌ Error enviando email:', emailResult.error);
                    }
                } catch (emailError) {
                    console.error('❌ Error enviando email:', emailError);
                }
            });
        } else {
            console.log('🔧 Webhook ignorado (tipo no manejado):', event.type);
        }

        res.json({ received: true });
    },

    // Función para obtener reservas pagadas
    getPaidBookings(req, res) {
        const query = `
            SELECT pb.*,
                   CASE
                       WHEN pb.service_type = 'masaje' THEN m.nombre_masaje
                       WHEN pb.service_type = 'ritual' THEN r.nombre_ritual
                       WHEN pb.service_type = 'facial' THEN f.nombre_ritualFacial
                   END as service_name
            FROM paid_bookings pb
            LEFT JOIN masajes m ON pb.service_type = 'masaje' AND pb.service_id = m.id_masaje
            LEFT JOIN rituales r ON pb.service_type = 'ritual' AND pb.service_id = r.id_ritual
            LEFT JOIN ritual_facial f ON pb.service_type = 'facial' AND pb.service_id = f.id_ritualFacial
            ORDER BY pb.created_at DESC
        `;

        conexion.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching paid bookings:', err);
                return res.status(500).json({ error: 'Error fetching bookings' });
            }
            res.json(results);
        });
    },

    // Función para validar QR
    validateQR(req, res) {
        const { qrCode } = req.params;

        console.log('🔧 Validando QR:', qrCode);

        const query = `
            SELECT pb.*,
                   CASE
                       WHEN pb.service_type = 'masaje' THEN m.nombre_masaje
                       WHEN pb.service_type = 'ritual' THEN r.nombre_ritual
                       WHEN pb.service_type = 'facial' THEN f.nombre_ritualFacial
                   END as service_name
            FROM paid_bookings pb
            LEFT JOIN masajes m ON pb.service_type = 'masaje' AND pb.service_id = m.id_masaje
            LEFT JOIN rituales r ON pb.service_type = 'ritual' AND pb.service_id = r.id_ritual
            LEFT JOIN ritual_facial f ON pb.service_type = 'facial' AND pb.service_id = f.id_ritualFacial
            WHERE pb.qr_code = ? AND pb.status = 'paid'
        `;

        conexion.query(query, [qrCode], (err, results) => {
            if (err) {
                console.error('Error validating QR:', err);
                return res.status(500).json({ error: 'Error validating QR' });
            }

            if (results.length === 0) {
                console.log('❌ QR no válido:', qrCode);
                return res.status(404).json({ error: 'QR no válido o ya utilizado' });
            }

            console.log('✅ QR válido:', qrCode);

            // Marcar como completado
            const updateQuery = 'UPDATE paid_bookings SET status = "completed" WHERE qr_code = ?';
            conexion.query(updateQuery, [qrCode], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating booking status:', updateErr);
                }
            });

            res.json({
                valid: true,
                booking: results[0],
                message: 'QR válido - Reserva completada'
            });
        });
    }
};

module.exports = paymentsController; 