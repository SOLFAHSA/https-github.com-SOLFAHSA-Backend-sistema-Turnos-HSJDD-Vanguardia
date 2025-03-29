// config/db.js - Configuración de la conexión a PostgreSQL

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Crear el pool de conexiones con la configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20, // Número máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar una conexión inactiva
    connectionTimeoutMillis: 2000, // Tiempo máximo para intentar conectar
});

// Verificar la conexión con la base de datos
pool.connect()
    .then(() => console.log('🟢 Conectado a la base de datos PostgreSQL'))
    .catch(err => console.error('🔴 Error al conectar a la base de datos:', err));

module.exports = pool;
