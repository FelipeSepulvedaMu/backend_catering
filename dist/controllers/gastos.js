"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
exports.default = {
    getByEvento: async (req, res) => {
        try {
            const { evento_id } = req.params;
            const { rows } = await db_1.default.query('SELECT * FROM gastos WHERE evento_id = $1 ORDER BY fecha_creacion DESC', [evento_id]);
            res.json(rows);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener gastos' });
        }
    },
    create: async (req, res) => {
        try {
            const { evento_id } = req.params;
            const { concepto, valor } = req.body;
            if (!concepto || valor === undefined) {
                return res.status(400).json({ error: 'Concepto y valor son requeridos' });
            }
            const { rows } = await db_1.default.query('INSERT INTO gastos (evento_id, concepto, valor) VALUES ($1, $2, $3) RETURNING id', [evento_id, concepto, valor]);
            res.status(201).json({ id: rows[0].id, evento_id, concepto, valor });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear gasto' });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await db_1.default.query('DELETE FROM gastos WHERE id = $1', [id]);
            res.json({ success: true });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar gasto' });
        }
    }
};
