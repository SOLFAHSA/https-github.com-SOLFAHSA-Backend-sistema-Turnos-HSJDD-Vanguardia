
// routes/pacientes.js - Rutas para la gestión de pacientes

const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');
const authenticateToken = require('../middlewares/auth');

/**
 * Validar datos de registro de paciente
 */
const validatePaciente = (req, res, next) => {
    const { identidad, nombres, apellidos } = req.body;
    if (!identidad || !nombres || !apellidos) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    next();
};

/**
 * Registrar un nuevo paciente (Protegido)
 * Método: POST
 * Ruta: /pacientes/register
 */
router.post('/register', authenticateToken, validatePaciente, pacientesController.registerPaciente);


/**
 * Obtener todos los pacientes (Protegido)
 * Método: GET
 * Ruta: /pacientes
 */
router.get('/', authenticateToken, pacientesController.getPacientes);


/**
 * Obtener un paciente por ID (Protegido)
 * Método: GET
 * Ruta: /pacientes/:id
 */
router.get('/:id', authenticateToken, pacientesController.getPacienteById);

/**
 * Eliminar un paciente por ID (Protegido)
 * Método: DELETE
 * Ruta: /pacientes/:id
 */
router.delete('/:id', authenticateToken, pacientesController.deletePaciente);

module.exports = router;
