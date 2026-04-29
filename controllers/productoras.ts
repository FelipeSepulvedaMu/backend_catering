import { Request, Response } from 'express';
import pool from '../db';

export default {
  getAll: async (req: Request, res: Response) => {
    try {
      const { rows } = await pool.query('SELECT * FROM productoras ORDER BY nombre ASC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch productoras' });
    }
  },
  create: async (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'Nombre is required' });
    }
    try {
      const { rows } = await pool.query('INSERT INTO productoras (nombre) VALUES ($1) RETURNING id', [nombre]);
      res.status(201).json({ id: rows[0].id, nombre });
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique_violation code
        return res.status(400).json({ error: 'Productora already exists' });
      }
      res.status(500).json({ error: 'Failed to create productora' });
    }
  }
};
