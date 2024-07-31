const express = require("express");
const path = require("path");
const cors = require("cors");
const bunyan = require("bunyan");

require("dotenv").config();

const ritualesRouter = require("./routes/rituales-router");
const adminRouter = require("./routes/admin-router");
const masajesRouter = require("./routes/masajes-router");
const citasRouter = require("./routes/citas-router");
const CitasMRouter = require("./routes/citasm-router");

const app = express();
const allowedOrigins = ['https://www.mondo.com.es', 'https://mondo-app-api.onrender.com'];

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "public")));

app.use("/masajes", masajesRouter);
app.use("/rituales", ritualesRouter);
app.use("/admin", adminRouter);
app.use("/citas", citasRouter);
app.use("/citasm", CitasMRouter);

const logger = bunyan.createLogger({name: "Servidor"});

let puerto = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(puerto, () => {
    logger.info("Servidor Levantado");
});
