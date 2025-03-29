
// controllers/medicosController.js - Controlador para la gestión de médicos

const pool = require('../config/db'); // Importar la conexión a la base de datos

console.log("🛠 medicosController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todos los médicos
 */
exports.getMedicos = async (req, res) => {
    console.log("🟢 getMedicos ejecutado.");
    try {
        const result = await pool.query('SELECT id, nombre, apellido, profesion, usuario_id FROM medicos ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener médicos");
    }
};

/**
 * Registrar un nuevo médico con validaciones
 */
exports.createMedico = async (req, res) => {
    console.log("🟢 createMedico ejecutado.");
    const { nombre, apellido, profesion, usuario_id } = req.body;

    if (!nombre || !apellido || !profesion || !usuario_id) {
        return res.status(400).json({ error: "Nombre, apellido, profesión y usuario_id son obligatorios" });
    }

    try {
        // Verificar si el usuario existe
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ error: "El usuario no existe" });
        }

        // Insertar nuevo médico
        const result = await pool.query(
            'INSERT INTO medicos (nombre, apellido, profesion, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, apellido, profesion, usuario_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar médico");
    }
};

/**
 * Obtener un médico por ID
 */
exports.getMedicoById = async (req, res) => {
    console.log("🟢 getMedicoById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM medicos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener médico");
    }
};

/**
 * Actualizar un médico existente
 */
exports.updateMedico = async (req, res) => {
    console.log("🟢 updateMedico ejecutado.");
    const { id } = req.params;
    const { nombre, apellido, profesion, usuario_id } = req.body;

    if (!nombre || !apellido || !profesion || !usuario_id) {
        return res.status(400).json({ error: "Nombre, apellido, profesión y usuario_id son obligatorios" });
    }

    try {
        // Verificar si el usuario existe
        const existingUser = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ error: "El usuario no existe" });
        }

        // Actualizar médico
        const result = await pool.query(
            'UPDATE medicos SET nombre = $1, apellido = $2, profesion = $3, usuario_id = $4 WHERE id = $5 RETURNING *',
            [nombre, apellido, profesion, usuario_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Médico no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al actualizar médico");
    }
};

/**
 * Eliminar un médico por ID
 */
exports.deleteMedico = async (req, res) => {
    console.log("🟢 deleteMedico ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM medicos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Médico no encontrado' });
        }
        res.json({ message: 'Médico eliminado correctamente' });
    } catch (error) {
        handleError(res, error, "Error al eliminar médico");
    }
};
