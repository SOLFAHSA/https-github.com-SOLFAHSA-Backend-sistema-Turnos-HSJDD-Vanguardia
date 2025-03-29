
// controllers/pacientesController.js - Controlador para la gestión de pacientes

const pool = require('../config/db'); // Importar la conexión a la base de datos

console.log("🛠 pacientesController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todos los pacientes
 */
exports.getPacientes = async (req, res) => {
    console.log("🟢 getPacientes ejecutado.");
    try {
        const result = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener pacientes");
    }
};

/**
 * Registrar un nuevo paciente con validaciones
 */
exports.registerPaciente = async (req, res) => {
    console.log("🟢 registerPaciente ejecutado.");
    const { identidad, nombres, apellidos } = req.body;

    // Validaciones
    if (!identidad || !nombres || !apellidos) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar que identidad solo contenga números y tenga 13 caracteres
    const identidadRegex = /^[0-9]{13}$/;
    if (!identidadRegex.test(identidad)) {
        return res.status(400).json({ error: "La identidad debe contener exactamente 13 dígitos numéricos" });
    }

    try {
        // Verificar si el paciente ya está registrado
        const existingPaciente = await pool.query('SELECT * FROM pacientes WHERE identidad = $1', [identidad]);
        if (existingPaciente.rows.length > 0) {
            return res.status(400).json({ error: "El paciente ya está registrado" });
        }

        // Insertar paciente
        const result = await pool.query(
            'INSERT INTO pacientes (identidad, nombres, apellidos) VALUES ($1, $2, $3) RETURNING *',
            [identidad, nombres, apellidos]
        );
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar paciente. Verifica la estructura de la base de datos.");
    }
};

/**
 * Obtener un paciente por ID
 */
exports.getPacienteById = async (req, res) => {
    console.log("🟢 getPacienteById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener paciente");
    }
};

/**
 * Eliminar un paciente por ID con manejo de restricciones
 */
exports.deletePaciente = async (req, res) => {
    console.log("🟢 deletePaciente ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM pacientes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado o tiene registros asociados' });
        }
        res.json({ message: 'Paciente eliminado correctamente' });
    } catch (error) {
        handleError(res, error, "Error al eliminar paciente. Puede estar relacionado con otros registros.");
    }
};
