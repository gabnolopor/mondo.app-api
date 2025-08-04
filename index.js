const express = require("express");
const path = require("path");
const cors = require("cors");
const bunyan = require("bunyan");


require("dotenv").config();

const conexion = require("./database");

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
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

//configuracion de puerto
let puerto = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    conexion.query('SELECT 1', (err, results) => {
        if (err) {
            logger.error("Error en la consulta de la base de datos", err);
            return res.status(500).send('Internal Server Error');
        } else {
            return res.status(200).send('OK');
        }
    });
});

app.listen(puerto, () => {
    logger.info("Servidor Levantado");
});
