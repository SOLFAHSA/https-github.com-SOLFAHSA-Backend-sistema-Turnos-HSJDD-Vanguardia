
// routes/medicos.js - Rutas para la gestión de médicos

const express = require('express');
const router = express.Router();
const medicosController = require('../controllers/medicosController');
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

/**
 * Obtener todos los médicos (Protegido)
 * Método: GET
 * Ruta: /medicos
 */
router.get('/', authenticateToken, medicosController.getMedicos);

/**
 * Obtener un médico por ID (Protegido)
 * Método: GET
 * Ruta: /medicos/:id
 */
router.get('/:id', authenticateToken, medicosController.getMedicoById);

/**
 * Registrar un nuevo médico (Protegido)
 * Método: POST
 * Ruta: /medicos
 */
router.post('/', authenticateToken, medicosController.createMedico);

/**
 * Actualizar un médico existente (Protegido)
 * Método: PUT
 * Ruta: /medicos/:id
 */
router.put('/:id', authenticateToken, medicosController.updateMedico);

/**
 * Eliminar un médico por ID (Protegido)
 * Método: DELETE
 * Ruta: /medicos/:id
 */
router.delete('/:id', authenticateToken, medicosController.deleteMedico);

module.exports = router;
