import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';

export default {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password requeridos' });
    }

    try {
      // 🔥 1. BUSCAR SOLO POR USERNAME
      const { rows } = await pool.query(
        'SELECT username, password FROM users WHERE username = $1',
        [username]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = rows[0];

      // 🔥 2. COMPARAR CON BCRYPT
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // 🔥 3. GENERAR TOKEN
      const token = generateToken({ username: user.username });

      return res.json({
        success: true,
        token,
        user: { username: user.username }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error del servidor' });
    }
  }
};