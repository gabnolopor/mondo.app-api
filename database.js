const mysql = require("mysql");
const bunyan = require("bunyan");

const logger = bunyan.createLogger({name: "Base de Datos"});

require("dotenv").config();

// Configuración del pool (ajustable según entorno)
const isProduction = process.env.NODE_ENV === 'production';
const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT) || (isProduction ? 10 : 5);

// Crear pool de conexiones
const pool = mysql.createPool({
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4',
    connectionLimit: connectionLimit,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    // Configuraciones adicionales para producción
    queueLimit: 0, // Ilimitado (por defecto), ajustar si es necesario
    waitForConnections: true, // Esperar si no hay conexiones disponibles
    // Para Render y otras plataformas cloud
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Manejar eventos del pool
pool.on('connection', (connection) => {
    logger.info('Nueva conexión establecida en el pool');
    
    connection.on('error', (err) => {
        logger.error('Error en la conexión del pool:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            logger.info('Conexión perdida, el pool la reemplazará automáticamente');
        }
    });
});

pool.on('acquire', (connection) => {
    logger.debug('Conexión adquirida del pool');
});

pool.on('release', (connection) => {
    logger.debug('Conexión liberada al pool');
});

// Manejar errores del pool
pool.on('error', (err) => {
    logger.error('Error en el pool de conexiones:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        logger.info('Error de conexión detectado, el pool lo manejará automáticamente');
    }
});

// Función helper para ejecutar queries (opcional, para compatibilidad)
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Función para obtener el pool directamente
const getPool = () => {
    return pool;
};

// Función para verificar el estado del pool
const isPoolHealthy = () => {
    return pool && pool._allConnections && pool._allConnections.length > 0;
};

// Función para cerrar el pool gracefulmente (importante para producción)
const closePool = (callback) => {
    if (pool) {
        logger.info('Cerrando pool de conexiones...');
        pool.end((err) => {
            if (err) {
                logger.error('Error al cerrar el pool:', err);
                if (callback) callback(err);
            } else {
                logger.info('Pool de conexiones cerrado correctamente');
                if (callback) callback(null);
            }
        });
    } else {
        if (callback) callback(null);
    }
};

// Manejar cierre graceful del proceso (importante para producción)
process.on('SIGTERM', () => {
    logger.info('SIGTERM recibido, cerrando pool...');
    closePool(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT recibido, cerrando pool...');
    closePool(() => {
        process.exit(0);
    });
});

// Keep alive periódico (opcional, para mantener conexiones activas en producción)
if (isProduction) {
    setInterval(() => {
        pool.query('SELECT 1', (err) => {
            if (err) {
                logger.error('Error en keep-alive del pool:', err);
            } else {
                logger.debug('Keep-alive ejecutado correctamente');
            }
        });
    }, 30000); // Cada 30 segundos
}

logger.info(`Pool de conexiones creado (connectionLimit: ${connectionLimit}, producción: ${isProduction})`);

module.exports = { pool, query, getPool, isPoolHealthy, closePool };
