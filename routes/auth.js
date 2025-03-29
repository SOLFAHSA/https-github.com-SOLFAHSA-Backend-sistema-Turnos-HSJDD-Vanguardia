
// routes/auth.js - Rutas para la autenticación de usuarios

const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Importar la conexión a la base de datos
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Validar formato de correo electrónico
 */
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Registrar un nuevo usuario con validaciones y control de duplicados
 * Método: POST
 * Ruta: /auth/register
 */
router.post('/register', async (req, res) => {
    const { usuario, correo, contraseña, rol } = req.body;

    // Validaciones
    if (!usuario || !correo || !contraseña || !rol) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!isValidEmail(correo)) {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }

    try {
        // Verificar si el usuario o correo ya existen
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 OR correo = $2', [usuario, correo]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "El usuario o correo ya están registrados" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Insertar nuevo usuario
        const result = await pool.query(
            'INSERT INTO usuarios (usuario, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, usuario, correo, rol',
            [usuario, correo, hashedPassword, rol]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

/**
 * Iniciar sesión y obtener un token JWT con información del usuario
 * Método: POST
 * Ruta: /auth/login
 */
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

        const usuario = result.rows[0];
        const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!validPassword) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

        // Generar token con información del usuario y expiración de 24 horas
        const token = jwt.sign(
            { id: usuario.id, usuario: usuario.usuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ 
            token, 
            usuario: { id: usuario.id, usuario: usuario.usuario, correo: usuario.correo, rol: usuario.rol } 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

module.exports = router;
