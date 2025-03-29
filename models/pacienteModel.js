
// models/pacienteModel.js - Modelo de Paciente con Sequelize

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Conexión a la base de datos

const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    identidad: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            isNumeric: true,
            len: [5, 20]
        }
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'pacientes',
    timestamps: false
});

module.exports = Paciente;
