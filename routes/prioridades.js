
// routes/prioridades.js - Rutas para la gestión de prioridades

const express = require('express');
const router = express.Router();
const prioridadesController = require('../controllers/prioridadesController');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

/**
 * Obtener todas las prioridades (Protegido)
 * Método: GET
 * Ruta: /prioridades
 */
router.get('/', authenticateToken, prioridadesController.getPrioridades);

/**
 * Crear una nueva prioridad (Protegido)
 * Método: POST
 * Ruta: /prioridades
 */
router.post('/', authenticateToken, prioridadesController.createPrioridad);

/**
 * Actualizar una prioridad existente (Protegido)
 * Método: PUT
 * Ruta: /prioridades/:id
 */
router.put('/:id', authenticateToken, prioridadesController.updatePrioridad);

/**
 * Obtener una prioridad por ID (Protegido)
 * Método: GET
 * Ruta: /prioridades/:id
 */
router.get('/:id', authenticateToken, prioridadesController.getPrioridadById);

/**
 * Eliminar una prioridad por ID (Protegido)
 * Método: DELETE
 * Ruta: /prioridades/:id
 */
router.delete('/:id', authenticateToken, prioridadesController.deletePrioridad);

module.exports = router;
