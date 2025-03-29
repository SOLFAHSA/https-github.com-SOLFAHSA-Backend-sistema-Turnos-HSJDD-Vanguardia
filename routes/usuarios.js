
// routes/usuarios.js - Rutas para la gestión de usuarios

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

/**
 * Obtener todos los usuarios (Protegido)
 * Método: GET
 * Ruta: /usuarios
 */
router.get('/', authenticateToken, usuariosController.getUsuarios);

/**
 * Registrar usuario
 * Método: POST
 * Ruta: /usuarios/resgister
 */
router.post('/register', usuariosController.registerUsuario);

/**
 * Iniciar sesión
 * Método: POST
 * Ruta: /usuarios/login
 */
router.post('/login', usuariosController.loginUsuario);

/**
 * Obtener un usuario por ID (Protegido)
 * Método: GET
 * Ruta: /usuarios/:id
 */
router.get('/:id', authenticateToken, usuariosController.getUsuarioById);

/**
 * Eliminar un usuario por ID (Protegido)
 * Método: DELETE
 * Ruta: /usuarios/:id
 */
router.delete('/:id', authenticateToken, usuariosController.deleteUsuario);

/**
 * Obtener perfil del usuario autenticado (Protegido)
 * Método: GET
 * Ruta: /usuarios/perfil
 */
router.get('/perfil', authenticateToken, (req, res) => {
    res.json({ usuario: req.user });
});

module.exports = router;
