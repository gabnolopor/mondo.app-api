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
const corsOptions = {
    origin: 'https://mondo.com.es', // Dominio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permite el uso de cookies
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use( express.static( path.join(__dirname,"public") ) );

app.use("/masajes",masajesRouter)
app.use("/rituales",ritualesRouter)
app.use("/admin",adminRouter)
app.use("/citas",citasRouter)
app.use("/citasm",CitasMRouter)


const logger = bunyan.createLogger({name: "Servidor"});

let puerto = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(puerto, ()=>{
    logger.info("Servidor Levantado")
})
