"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
exports.default = {
    login: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username y password requeridos' });
        }
        try {
            // 🔥 1. BUSCAR SOLO POR USERNAME
            const { rows } = await db_1.default.query('SELECT username, password FROM users WHERE username = $1', [username]);
            if (rows.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            const user = rows[0];
            // 🔥 2. COMPARAR CON BCRYPT
            const isMatch = await bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            // 🔥 3. GENERAR TOKEN
            const token = (0, jwt_1.generateToken)({ username: user.username });
            return res.json({
                success: true,
                token,
                user: { username: user.username }
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error del servidor' });
        }
    }
};
