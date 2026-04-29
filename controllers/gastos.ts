import { Request, Response } from 'express';
import pool from '../db';

export default {
  getByEvento: async (req: Request, res: Response) => {
    try {
      const { evento_id } = req.params;
      const { rows } = await pool.query('SELECT * FROM gastos WHERE evento_id = $1 ORDER BY fecha_creacion DESC', [evento_id]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener gastos' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { evento_id } = req.params;
      const { concepto, valor } = req.body;

      if (!concepto || valor === undefined) {
        return res.status(400).json({ error: 'Concepto y valor son requeridos' });
      }

      const { rows } = await pool.query('INSERT INTO gastos (evento_id, concepto, valor) VALUES ($1, $2, $3) RETURNING id', [evento_id, concepto, valor]);

      res.status(201).json({ id: rows[0].id, evento_id, concepto, valor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear gasto' });
    }
  },
  
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM gastos WHERE id = $1', [id]);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar gasto' });
    }
  }
};
