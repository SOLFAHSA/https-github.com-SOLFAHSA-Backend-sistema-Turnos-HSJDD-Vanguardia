
// controllers/prioridadesController.js - Controlador para la gestión de prioridades

const pool = require('../config/db'); // Importar la conexión a la base de datos

console.log("🛠 prioridadesController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todas las prioridades
 */
exports.getPrioridades = async (req, res) => {
    console.log("🟢 getPrioridades ejecutado.");
    try {
        const result = await pool.query('SELECT id, nombre, nivel_prioridad FROM prioridades ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener prioridades");
    }
};

/**
 * Registrar una nueva prioridad con validaciones y control de duplicados
 */
exports.createPrioridad = async (req, res) => {
    console.log("🟢 createPrioridad ejecutado.");
    const { nombre, nivel_prioridad } = req.body;

    if (!nombre || nivel_prioridad == null) {
        return res.status(400).json({ error: "Nombre y nivel_prioridad son obligatorios" });
    }

    try {
        // Verificar si la prioridad ya existe
        const existingPrioridad = await pool.query('SELECT * FROM prioridades WHERE nombre = $1', [nombre]);
        if (existingPrioridad.rows.length > 0) {
            return res.status(400).json({ error: "La prioridad ya existe" });
        }

        const result = await pool.query(
            'INSERT INTO prioridades (nombre, nivel_prioridad) VALUES ($1, $2) RETURNING *',
            [nombre, nivel_prioridad]
        );

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar prioridad");
    }
};

/**
 * Actualizar una prioridad existente
 */
exports.updatePrioridad = async (req, res) => {
    console.log("🟢 updatePrioridad ejecutado.");
    const { id } = req.params;
    const { nombre, nivel_prioridad } = req.body;

    if (!nombre || nivel_prioridad == null) {
        return res.status(400).json({ error: "Nombre y nivel son obligatorios" });
    }

    try {
        // Verificar si la prioridad con ese nombre ya existe en otro ID
        const existingPrioridad = await pool.query('SELECT * FROM prioridades WHERE nombre = $1 AND id != $2', [nombre, id]);
        if (existingPrioridad.rows.length > 0) {
            return res.status(400).json({ error: "Otra prioridad con este nombre ya existe" });
        }

        const result = await pool.query(
            'UPDATE prioridades SET nombre = $1, nivel_prioridad = $2 WHERE id = $3 RETURNING *',
            [nombre, nivel_prioridad, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Prioridad no encontrada" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al actualizar prioridad");
    }
};

/**
 * Obtener una prioridad por ID
 */
exports.getPrioridadById = async (req, res) => {
    console.log("🟢 getPrioridadById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM prioridades WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prioridad no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener prioridad");
    }
};

/**
 * Eliminar una prioridad por ID con manejo de restricciones
 */
exports.deletePrioridad = async (req, res) => {
    console.log("🟢 deletePrioridad ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM prioridades WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Prioridad no encontrada o tiene registros asociados' });
        }
        res.json({ message: 'Prioridad eliminada correctamente' });
    } catch (error) {
        handleError(res, error, "Error al eliminar prioridad. Puede estar relacionada con otros registros.");
    }
};
