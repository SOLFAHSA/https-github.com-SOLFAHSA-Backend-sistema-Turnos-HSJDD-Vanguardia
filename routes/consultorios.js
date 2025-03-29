
// routes/consultorios.js - Rutas para la gestión de consultorios

const express = require('express');
const router = express.Router();
const consultoriosController = require('../controllers/consultoriosController');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

/**
 * Obtener todos los consultorios (Protegido)
 * Método: GET
 * Ruta: /consultorios
 */
router.get('/', authenticateToken, consultoriosController.getConsultorios);

/**
 * Obtener un consultorio por ID (Protegido)
 * Método: GET
 * Ruta: /consultorios/:id
 */
router.get('/:id', authenticateToken, consultoriosController.getConsultorioById);

/**
 * Registrar un nuevo consultorio (Protegido)
 * Método: POST
 * Ruta: /consultorios
 */
router.post('/', authenticateToken, consultoriosController.createConsultorio);

/**
 * Actualizar un consultorio existente (Protegido)
 * Método: PUT
 * Ruta: /consultorios/:id
 */
router.put('/:id', authenticateToken, consultoriosController.updateConsultorio);

/**
 * Eliminar un consultorio por ID (Protegido)
 * Método: DELETE
 * Ruta: /consultorios/:id
 */
router.delete('/:id', authenticateToken, consultoriosController.deleteConsultorio);

module.exports = router;
