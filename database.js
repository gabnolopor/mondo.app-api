const mysql = require("mysql");

const bunyan = require("bunyan");

const logger = bunyan.createLogger({name: "Base de Datos"});

require("dotenv").config();

// Función para crear una nueva conexión
const createConnection = () => {
    return mysql.createConnection({
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
    });
};

// Variable global para la conexión
let conexion = createConnection();

// Función para verificar si la conexión está activa
const isConnectionActive = () => {
    return conexion && conexion.state === 'authenticated';
};

// Función para reconectar si es necesario
const ensureConnection = (callback) => {
    if (!isConnectionActive()) {
        logger.info('Reconectando a la base de datos...');
        
        // Crear una nueva conexión si la actual está corrupta
        if (conexion && (conexion.state === 'protocol_error' || conexion.state === 'disconnected')) {
            logger.info('Conexión corrupta detectada, creando nueva conexión...');
            conexion = createConnection();
        }
        
        conexion.connect((err) => {
            if (err) {
                logger.error('Error al reconectar:', err);
                // Si es un error fatal, intentar crear una nueva conexión
                if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                    logger.info('Error fatal detectado, creando nueva conexión limpia...');
                    try {
                        conexion = createConnection();
                        conexion.connect((retryErr) => {
                            if (retryErr) {
                                logger.error('Error al crear nueva conexión:', retryErr);
                                callback(retryErr);
                            } else {
                                logger.info('Nueva conexión creada exitosamente');
                                callback(null);
                            }
                        });
                    } catch (error) {
                        logger.error('Error al crear nueva conexión:', error);
                        callback(error);
                    }
                } else {
                    callback(err);
                }
            } else {
                logger.info('Reconectado exitosamente');
                callback(null);
            }
        });
    } else {
        callback(null);
    }
};

// Función para obtener una nueva conexión limpia
const getNewConnection = () => {
    logger.info('Creando nueva conexión limpia...');
    conexion = createConnection();
    return conexion;
};

try{
    conexion.connect((err)=>{
        if(err){
            logger.error("Error en la conexión inicial a la BD:", err);
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
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        logger.info('Error fatal detectado, creando nueva conexión...');
        setTimeout(() => {
            try {
                conexion = createConnection();
                conexion.connect((err) => {
                    if (err) {
                        logger.error('Error al crear nueva conexión:', err);
                    } else {
                        logger.info('Nueva conexión creada exitosamente');
                    }
                });
            } catch (error) {
                logger.error('Error al crear nueva conexión:', error);
            }
        }, 2000);
    }
});

// Keep alive cada 30 segundos
setInterval(() => {
    if (isConnectionActive()) {
        conexion.query('SELECT 1', (err) => {
            if (err) {
                logger.error('Error en keep-alive:', err);
                // Si hay error en keep-alive, crear nueva conexión
                if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
                    logger.info('Error fatal en keep-alive, creando nueva conexión...');
                    getNewConnection();
                }
            }
        });
    }
}, 30000);

module.exports = { conexion, isConnectionActive, ensureConnection, getNewConnection };
