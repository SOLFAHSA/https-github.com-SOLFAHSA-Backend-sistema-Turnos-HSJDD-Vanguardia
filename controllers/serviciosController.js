
// controllers/serviciosController.js - Controlador para la gestión de servicios

const pool = require('../config/db'); // Importar la conexión a la base de datos

console.log("🛠 serviciosController.js cargado correctamente.");

/**
 * Manejo centralizado de errores
 */
const handleError = (res, error, message = "Error interno del servidor") => {
    console.error(`🔴 ${message}:`, error.message);
    res.status(500).json({ error: message });
};

/**
 * Obtener todos los servicios
 */
exports.getServicios = async (req, res) => {
    console.log("🟢 getServicios ejecutado.");
    try {
        const result = await pool.query('SELECT id, nombre, letra, numero_inicial FROM servicios ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        handleError(res, error, "Error al obtener servicios");
    }
};

/**
 * Registrar un nuevo servicio con validaciones
 */
exports.createServicio = async (req, res) => {
    console.log("🟢 createServicio ejecutado.");
    const { nombre, letra, numero_inicial } = req.body;

    if (!nombre || !letra || numero_inicial == null) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO servicios (nombre, letra, numero_inicial) VALUES ($1, $2, $3) RETURNING *',
            [nombre, letra, numero_inicial]
        );

        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al registrar servicio");
    }
};

/**
 * Obtener un servicio por ID
 */
exports.getServicioById = async (req, res) => {
    console.log("🟢 getServicioById ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM servicios WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        handleError(res, error, "Error al obtener servicio");
    }
};

/**
 * Eliminar un servicio por ID con manejo de restricciones
 */
exports.deleteServicio = async (req, res) => {
    console.log("🟢 deleteServicio ejecutado.");
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM servicios WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado o tiene registros asociados' });
        }
        res.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        handleError(res, error, "Error al eliminar servicio. Puede estar relacionado con otros registros.");
    }
};
