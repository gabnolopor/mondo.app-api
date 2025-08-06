const mysql = require("mysql");

const bunyan = require("bunyan");

const logger = bunyan.createLogger({name: "Base de Datos"});

require("dotenv").config();

//configuracion de conexion a la base de datos
const conexion = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Configuraciones adicionales para Render
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4'
})

try{

    conexion.connect((err)=>{

        if(err){
            logger.error("Error en la conexión a la BD:", err);
            return;
        }
        logger.info("Conectado a la BD")

    })

}catch(error){

    logger.error("Error en la conexión:", error);

}

// Manejar reconexión automática
conexion.on('error', (err) => {
    logger.error('Error en la conexión MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        logger.info('Reconectando a la base de datos...');
        conexion.connect((err) => {
            if (err) {
                logger.error('Error al reconectar:', err);
            } else {
                logger.info('Reconectado exitosamente');
            }
        });
    }
});

module.exports = conexion;
