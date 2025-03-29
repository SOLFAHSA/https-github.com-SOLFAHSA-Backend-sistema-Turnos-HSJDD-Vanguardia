
// server.js - Configuración principal del servidor con Express

// Importar las dependencias necesarias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./config/db'); // Conexión a la base de datos

// Configurar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

// Crear servidor HTTP para usar con WebSockets
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Manejar conexión de WebSockets
io.on('connection', (socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`🔴 Cliente desconectado: ${socket.id}`);
    });
});

// Exportar `app` y `io`
module.exports = { app, io };

// Importar y configurar rutas con manejo de errores
try {
    app.use('/usuarios', require('./routes/usuarios'));
    app.use('/pacientes', require('./routes/pacientes'));
    app.use('/tickets', require('./routes/tickets'));
    app.use('/medicos', require('./routes/medicos'));
    app.use('/consultorios', require('./routes/consultorios'));
    app.use('/servicios', require('./routes/servicios'));
    app.use('/prioridades', require('./routes/prioridades'));
    app.use('/auth', require('./routes/auth'));

    console.log("🛠 Rutas cargadas correctamente.");
} catch (error) {
    console.error("🔴 Error al cargar las rutas:", error.message);
}

// Manejar errores generales del servidor
app.use((err, req, res, next) => {
    console.error("🔴 Error interno del servidor:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Cerrar conexiones al detener el servidor
process.on('SIGINT', async () => {
    console.log('🔴 Cerrando servidor y conexiones...');
    await pool.end();
    console.log('🟢 Conexiones cerradas correctamente.');
    process.exit(0);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
