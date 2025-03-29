
// routes/tickets.js - Rutas para la gestión de tickets

const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');
const authenticateToken = require('../middlewares/auth');

/**
 * Validar datos de creación de ticket
 */
const validateTicket = (req, res, next) => {
    const { paciente_id, servicio_id, prioridad_id } = req.body;
    if (!paciente_id || !servicio_id || !prioridad_id) {
        return res.status(400).json({ error: "Paciente, servicio y prioridad son obligatorios" });
    }
    next();
};

/**
 * Obtener todos los tickets (Protegido)
 * Método: GET
 * Ruta: /tickets
 */
router.get('/', authenticateToken, ticketsController.getTickets);

/**
 * Crear un nuevo ticket (Protegido)
 * Método: POST
 * Ruta: /tickets
 */
router.post('/', authenticateToken, validateTicket, ticketsController.createTicket);


// Crear ticket desde módulo público (sin token)
router.post('/publico', ticketsController.generarTicketPublico);


/**
 * Obtener un ticket por ID (Protegido)
 * Método: GET
 * Ruta: /tickets/:id
 */
router.get('/:id', authenticateToken, ticketsController.getTicketById);

/**
 * Eliminar un ticket por ID (Protegido)
 * Método: DELETE
 * Ruta: /tickets/:id
 */
router.delete('/:id', authenticateToken, ticketsController.deleteTicket);

/**
 * Llamar un ticket (Protegido)
 * Método: POST
 * Ruta: /tickets/llamar
 */
router.post('/llamar', authenticateToken, ticketsController.llamarTicket);

/**
 * Actualizar el estado de un ticket (Protegido)
 * Método: PUT
 * Ruta: /tickets/:id/estado
 */
router.put('/:id/estado', authenticateToken, ticketsController.updateTicketStatus);

module.exports = router;
