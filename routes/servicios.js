
// routes/servicios.js - Rutas para la gestión de servicios

const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

/**
 * Obtener todos los servicios (Protegido)
 * Método: GET
 * Ruta: /servicios
 */
router.get('/', authenticateToken, serviciosController.getServicios);

/**
 * Crear un nuevo servicio (Protegido)
 * Método: POST
 * Ruta: /servicios
 */
router.post('/', authenticateToken, serviciosController.createServicio);

/**
 * Obtener un servicio por ID (Protegido)
 * Método: GET
 * Ruta: /servicios/:id
 */
router.get('/:id', authenticateToken, serviciosController.getServicioById);

/**
 * Eliminar un servicio por ID (Protegido)
 * Método: DELETE
 * Ruta: /servicios/:id
 */
router.delete('/:id', authenticateToken, serviciosController.deleteServicio);

module.exports = router;
