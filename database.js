const mysql = require("mysql");

const bunyan = require("bunyan");

const logger = bunyan.createLogger({name: "Base de Datos"});

require("dotenv").config();

//configuracion de conexion a la base de datos
const conexion = mysql.createConnection({
    port: process.env.DB_PORT || 3306, // Puerto por defecto de MySQL si no está configurado
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    // Configuraciones adicionales para Render
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4',
    // Keep alive para mantener la conexión activa
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true
})

// Función para verificar si la conexión está activa
const isConnectionActive = () => {
    return conexion && conexion.state === 'authenticated';
};

// Función para reconectar si es necesario
const ensureConnection = (callback) => {
    if (!isConnectionActive()) {
        logger.info('Reconectando a la base de datos...');
        conexion.connect((err) => {
            if (err) {
                logger.error('Error al reconectar:', err);
                callback(err);
            } else {
                logger.info('Reconectado exitosamente');
                callback(null);
            }
        });
    } else {
        callback(null);
    }
};

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
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        logger.info('Reconectando a la base de datos...');
        setTimeout(() => {
            conexion.connect((err) => {
                if (err) {
                    logger.error('Error al reconectar:', err);
                } else {
                    logger.info('Reconectado exitosamente');
                }
            });
        }, 2000);
    }
});

// Keep alive cada 30 segundos
setInterval(() => {
    if (isConnectionActive()) {
        conexion.query('SELECT 1', (err) => {
            if (err) {
                logger.error('Error en keep-alive:', err);
            }
        });
    }
}, 30000);

module.exports = { conexion, isConnectionActive, ensureConnection };
