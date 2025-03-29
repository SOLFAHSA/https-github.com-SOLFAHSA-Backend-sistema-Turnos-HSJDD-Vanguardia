
// controllers/consultoriosController.js - Controlador para la gestión de consultorios

const pool = require('../config/db'); // Importar la conexión a la base de datos

console.log("🛠 consultoriosController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todos los consultorios
 */
exports.getConsultorios = async (req, res) => {
    console.log("🟢 getConsultorios ejecutado.");
    try {
        const result = await pool.query('SELECT * FROM consultorios ORDER BY numero ASC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener consultorios");
    }
};

/**
 * Registrar un nuevo consultorio con validaciones
 */
exports.createConsultorio = async (req, res) => {
    console.log("🟢 createConsultorio ejecutado.");
    const { numero, servicio_id, medico_id } = req.body;

    if (!numero || !servicio_id || !medico_id) {
        return res.status(400).json({ error: "Número, servicio_id y medico_id son obligatorios" });
    }

    try {
        // Verificar si el servicio existe
        const servicio = await pool.query('SELECT * FROM servicios WHERE id = $1', [servicio_id]);
        if (servicio.rows.length === 0) {
            return res.status(400).json({ error: "El servicio no existe" });
        }

        // Verificar si el médico existe
        const medico = await pool.query('SELECT * FROM medicos WHERE id = $1', [medico_id]);
        if (medico.rows.length === 0) {
            return res.status(400).json({ error: "El médico no existe" });
        }

        // Verificar si el consultorio ya existe con los mismos datos
        const existingConsultorio = await pool.query(
            'SELECT * FROM consultorios WHERE numero = $1 AND servicio_id = $2 AND medico_id = $3',
            [numero, servicio_id, medico_id]
        );
        if (existingConsultorio.rows.length > 0) {
            return res.status(400).json({ error: "Este consultorio ya está registrado con los mismos datos" });
        }

        // Insertar nuevo consultorio
        const result = await pool.query(
            'INSERT INTO consultorios (numero, servicio_id, medico_id) VALUES ($1, $2, $3) RETURNING *',
            [numero, servicio_id, medico_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar consultorio");
    }
};

/**
 * Obtener un consultorio por ID
 */
exports.getConsultorioById = async (req, res) => {
    console.log("🟢 getConsultorioById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM consultorios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consultorio no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener consultorio");
    }
};

/**
 * Actualizar un consultorio existente
 */
exports.updateConsultorio = async (req, res) => {
    console.log("🟢 updateConsultorio ejecutado.");
    const { id } = req.params;
    const { numero, servicio_id, medico_id } = req.body;

    if (!numero || !servicio_id || !medico_id) {
        return res.status(400).json({ error: "Número, servicio_id y medico_id son obligatorios" });
    }

    try {
        // Verificar si el servicio existe
        const servicio = await pool.query('SELECT * FROM servicios WHERE id = $1', [servicio_id]);
        if (servicio.rows.length === 0) {
            return res.status(400).json({ error: "El servicio no existe" });
        }

        // Verificar si el médico existe
        const medico = await pool.query('SELECT * FROM medicos WHERE id = $1', [medico_id]);
        if (medico.rows.length === 0) {
            return res.status(400).json({ error: "El médico no existe" });
        }

        // Actualizar consultorio
        const result = await pool.query(
            'UPDATE consultorios SET numero = $1, servicio_id = $2, medico_id = $3 WHERE id = $4 RETURNING *',
            [numero, servicio_id, medico_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Consultorio no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al actualizar consultorio");
    }
};

/**
 * Eliminar un consultorio por ID
 */
exports.deleteConsultorio = async (req, res) => {
    console.log("🟢 deleteConsultorio ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM consultorios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Consultorio no encontrado' });
        }
        res.json({ message: 'Consultorio eliminado correctamente' });
    } catch (error) {
        handleError(res, error, "Error al eliminar consultorio");
    }
};
