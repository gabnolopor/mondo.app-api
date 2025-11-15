const express = require("express");
const path = require("path");
const cors = require("cors");
const bunyan = require("bunyan");


require("dotenv").config();

const { pool, isPoolHealthy } = require("./database");

//configuracion de logger
const logger = bunyan.createLogger({name: "ServidorMondo"});

//declaracion de rutas
const ritualesRouter = require("./routes/rituales-router");
const adminRouter = require("./routes/admin-router");
const masajesRouter = require("./routes/masajes-router");
const citasRouter = require("./routes/citas-router");
const CitasMRouter = require("./routes/citasm-router");
const CitasFRouter = require("./routes/citasf-router");
const clientsRouter = require("./routes/clients-router");
const servicesRouter = require("./routes/services-router");
const profileRouter = require("./routes/profile-router");
const facialesRouter = require("./routes/faciales-router");
const qrRouter = require("./routes/qr-router");
const paymentsRouter = require("./routes/payments-router");
const productsRouter = require("./routes/products-router");
const emailRouter = require("./routes/email-router");
const app = express();

const allowedOrigins = ['https://mondo.com.es','https://www.mondo.com.es', 'http://localhost:5173'];
const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin encabezado Origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}, Origin: ${req.headers.origin}`);
    next();
});

//configuracion de cors
app.use(cors(corsOptions));

// Configurar raw body para webhooks de Stripe
app.use('/payments/webhook', express.raw({ type: 'application/json' }));

// Configurar JSON parsing para todas las demás rutas
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//configuracion de static
app.use(express.static(path.join(__dirname,"public")));

//configuracion de rutas
app.use("/masajes", masajesRouter);
app.use("/rituales", ritualesRouter);
app.use("/admin", adminRouter);
app.use("/citas", citasRouter);
app.use("/citasm", CitasMRouter);
app.use("/citasf", CitasFRouter);
app.use("/clients", clientsRouter);
app.use("/services", servicesRouter);
app.use("/profile", profileRouter);
app.use("/faciales", facialesRouter);
app.use("/qr", qrRouter);
app.use("/payments", paymentsRouter);
app.use("/products", productsRouter);
app.use("/email", emailRouter);
//configuracion de puerto
let puerto = process.env.PORT || 3000;

// Endpoint de root simple
app.get('/', (req, res) => {
    console.log('🔧 Root GET request received');
    console.log('🔧 Sending root response...');
    res.status(200).send('Mondo API is running');
    console.log('✅ Root response sent');
});

app.get('/health', (req, res) => {
    console.log('🔧 Health check GET request received');
    console.log('🔧 Sending response...');
    res.status(200).send('OK');
    console.log('✅ Health check response sent');
});

// Manejar peticiones HEAD también
app.head('/health', (req, res) => {
    console.log('🔧 Health check HEAD request received');
    console.log('🔧 Sending HEAD response...');
    res.status(200).end();
    console.log('✅ Health check HEAD response sent');
});

// Health check más detallado (opcional)
app.get('/health/detailed', (req, res) => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            logger.error("Error en la consulta de la base de datos", err);
            return res.status(500).json({ 
                status: 'ERROR',
                error: 'Database query failed',
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(200).json({ 
                status: 'OK',
                database: 'Connected',
                timestamp: new Date().toISOString(),
                service: 'Mondo API'
            });
        }
    });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error global:', err);
    logger.error("Error no manejado:", err);
    
    // Si es un error de CORS
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'CORS not allowed' });
    }
    
    // Error genérico
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Something went wrong'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(puerto, () => {
    logger.info("Servidor Levantado");
});
