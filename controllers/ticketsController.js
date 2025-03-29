// controllers/ticketsController.js - Controlador para la gestión de tickets

const pool = require('../config/db'); // Importar la conexión a la base de datos
const { io } = require('../server'); // Importamos correctamente `io` desde server.js

console.log("🛠 ticketsController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todos los tickets
 */
exports.getTickets = async (req, res) => {
    console.log("🟢 getTickets ejecutado.");
    try {
        const result = await pool.query('SELECT * FROM tickets ORDER BY fecha_hora DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener tickets");
    }
};

/**
 * Crear un nuevo ticket con validaciones y WebSockets
 */
exports.createTicket = async (req, res) => {
    console.log("🟢 createTicket ejecutado.");
    let { paciente_id, servicio_id, prioridad_id, estado } = req.body;

    if (!paciente_id || !servicio_id || !prioridad_id) {
        return res.status(400).json({ error: "Paciente, servicio y prioridad son obligatorios" });
    }

    estado = estado || 'pendiente';

    try {
        // Obtener el número inicial desde la tabla servicios
        const servicio = await pool.query('SELECT numero_inicial FROM servicios WHERE id = $1', [servicio_id]);

        if (servicio.rows.length === 0) {
            return res.status(400).json({ error: "El servicio no existe" });
        }

        const numeroInicial = servicio.rows[0].numero_inicial;

        // Obtener el último número de ticket de ese servicio
        const lastTicket = await pool.query(
            'SELECT COALESCE(MAX(numero_ticket)::integer, $1 - 1) AS ultimo FROM tickets WHERE servicio_id = $2', 
            [numeroInicial, servicio_id]
        );

        const nuevoNumero = lastTicket.rows[0].ultimo + 1;

        const result = await pool.query(
            `INSERT INTO tickets (numero_ticket, paciente_id, servicio_id, prioridad_id, estado) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nuevoNumero, paciente_id, servicio_id, prioridad_id, estado]
        );

        const newTicket = result.rows[0];
        io.emit("nuevo_ticket", newTicket);

        res.json(newTicket);
    } catch (error) {
        handleError(res, error, "Error al crear ticket");
    }
};

/**
 * Obtener un ticket por ID
 */
exports.getTicketById = async (req, res) => {
    console.log("🟢 getTicketById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener ticket");
    }
};

/**
 * Actualizar el estado de un ticket
 */
exports.updateTicketStatus = async (req, res) => {
    console.log("🟢 updateTicketStatus ejecutado.");
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: "El estado es obligatorio" });
    }

    try {
        const result = await pool.query(
            'UPDATE tickets SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }

        const updatedTicket = result.rows[0];
        io.emit("ticket_actualizado", updatedTicket);

        res.json(updatedTicket);
    } catch (error) {
        handleError(res, error, "Error al actualizar el estado del ticket");
    }
};

/**
 * Eliminar un ticket por ID
 */
exports.deleteTicket = async (req, res) => {
    console.log("🟢 deleteTicket ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }
        res.json({ message: "Ticket eliminado correctamente" });
    } catch (error) {
        handleError(res, error, "Error al eliminar el ticket");
    }
};

/**
 * Llamar a un ticket y marcarlo como "llamado"
 */
exports.llamarTicket = async (req, res) => {
    console.log("🟢 llamarTicket ejecutado.");
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "El ID del ticket es obligatorio" });
    }

    try {
        const result = await pool.query(
            "UPDATE tickets SET estado = 'llamado' WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        const updatedTicket = result.rows[0];
        io.emit("ticket_llamado", updatedTicket);

        res.json(updatedTicket);
    } catch (error) {
        handleError(res, error, "Error al llamar ticket");
    }
};
