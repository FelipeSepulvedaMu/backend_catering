"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
exports.default = {
    getAll: async (req, res) => {
        try {
            const { rows } = await db_1.default.query('SELECT * FROM contactos ORDER BY nombre ASC');
            res.json(rows);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch contactos' });
        }
    },
    create: async (req, res) => {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'Nombre is required' });
        }
        try {
            const { rows } = await db_1.default.query('INSERT INTO contactos (nombre) VALUES ($1) RETURNING id', [nombre]);
            res.status(201).json({ id: rows[0].id, nombre });
        }
        catch (error) {
            if (error.code === '23505') { // Postgres unique_violation code
                return res.status(400).json({ error: 'Contacto already exists' });
            }
            res.status(500).json({ error: 'Failed to create contacto' });
        }
    }
};
