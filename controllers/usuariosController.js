
// controllers/usuariosController.js - Controlador para la gestión de usuarios

const pool = require('../config/db'); // Conexión a la base de datos
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

console.log("🛠 usuariosController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Validar formato de correo electrónico
 */
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Obtener todos los usuarios
 */
exports.getUsuarios = async (req, res) => {
    console.log("🟢 getUsuarios ejecutado.");
    try {
        const result = await pool.query('SELECT id, usuario, correo, rol FROM usuarios ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener usuarios");
    }
};

/**
 * Obtener un usuario por ID
 */
exports.getUsuarioById = async (req, res) => {
    console.log("🟢 getUsuarioById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT id, usuario, correo, rol FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener usuario");
    }
};

/**
 * Eliminar un usuario por ID
 */
exports.deleteUsuario = async (req, res) => {
    console.log("🟢 deleteUsuario ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        handleError(res, error, "Error al eliminar usuario");
    }
};

/**
 * Registrar un nuevo usuario con validaciones y control de duplicados
 */
exports.registerUsuario = async (req, res) => {
    console.log("🟢 registerUsuario ejecutado.");
    const { usuario, correo, contraseña, rol } = req.body;

    if (!usuario || !correo || !contraseña || !rol) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!isValidEmail(correo)) {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 OR correo = $2', [usuario, correo]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "El usuario o correo ya están registrados" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        const result = await pool.query(
            'INSERT INTO usuarios (usuario, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, usuario, correo, rol',
            [usuario, correo, hashedPassword, rol]
        );

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar usuario");
    }
};

/**
 * Iniciar sesión y obtener un token JWT con expiración
 */
exports.loginUsuario = async (req, res) => {
    console.log("🟢 loginUsuario ejecutado.");
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

        const token = jwt.sign(
            { id: usuario.id, usuario: usuario.usuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, usuario: { id: usuario.id, usuario: usuario.usuario, correo: usuario.correo, rol: usuario.rol } });
    } catch (error) {
        handleError(res, error, "Error al iniciar sesión");
    }
};
