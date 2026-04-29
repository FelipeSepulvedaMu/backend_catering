import { Request, Response } from 'express';
import pool from '../db';

export default {
  getAll: async (req: Request, res: Response) => {
    try {
      const { rows } = await pool.query(`
        SELECT 
          e.*, 
          p.nombre as productora_nombre, 
          c.nombre as contacto_nombre,
          COALESCE((SELECT SUM(valor) FROM gastos WHERE evento_id = e.id), 0) as total_gastos
        FROM eventos e
        JOIN productoras p ON e.productora_id = p.id
        JOIN contactos c ON e.contacto_id = c.id
        ORDER BY e.fecha DESC, e.hora_entrada DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch eventos' });
    }
  },
  create: async (req: Request, res: Response) => {
    const { 
      productora_id, 
      contacto_id, 
      direccion, 
      lat, 
      lng, 
      hora_entrada, 
      hora_salida, 
      fecha, 
      valor_por_persona, 
      valor_hora_extra,
      cantidad_personas 
    } = req.body;

    // Basic validation
    if (!productora_id || !contacto_id || !fecha || !valor_por_persona || valor_hora_extra === undefined || !cantidad_personas) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
      const { rows } = await pool.query(`
        INSERT INTO eventos (
          productora_id, contacto_id, direccion, lat, lng, hora_entrada, hora_salida, fecha, valor_por_persona, valor_hora_extra, cantidad_personas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id
      `, [
        productora_id, 
        contacto_id, 
        direccion || '', 
        lat || null, 
        lng || null, 
        hora_entrada || '', 
        hora_salida || '', 
        fecha, 
        valor_por_persona, 
        valor_hora_extra,
        cantidad_personas
      ]);
      
      res.status(201).json({ id: rows[0].id, message: 'Evento created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create evento' });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(`
        SELECT 
          e.*, 
          p.nombre as productora_nombre, 
          c.nombre as contacto_nombre 
        FROM eventos e
        JOIN productoras p ON e.productora_id = p.id
        JOIN contactos c ON e.contacto_id = c.id
        WHERE e.id = $1
      `, [id]);
      
      if (rows.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch evento' });
    }
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
      productora_id, 
      contacto_id, 
      direccion, 
      lat, 
      lng, 
      hora_entrada, 
      hora_salida, 
      fecha, 
      valor_por_persona, 
      valor_hora_extra,
      cantidad_personas 
    } = req.body;

    if (!productora_id || !contacto_id || !fecha || !valor_por_persona || valor_hora_extra === undefined || !cantidad_personas) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
      await pool.query(`
        UPDATE eventos SET
          productora_id = $1, contacto_id = $2, direccion = $3, lat = $4, lng = $5, 
          hora_entrada = $6, hora_salida = $7, fecha = $8, valor_por_persona = $9, valor_hora_extra = $10, cantidad_personas = $11
        WHERE id = $12
      `, [
        productora_id, contacto_id, direccion || '', lat || null, lng || null, 
        hora_entrada || '', hora_salida || '', fecha, valor_por_persona, valor_hora_extra, cantidad_personas, id
      ]);
      
      res.json({ success: true, message: 'Evento updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update evento' });
    }
  },
  reprogramar: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fecha, hora_entrada, hora_salida } = req.body;
    try {
      await pool.query('UPDATE eventos SET fecha = $1, hora_entrada = $2, hora_salida = $3 WHERE id = $4', [fecha, hora_entrada, hora_salida, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reprogramar evento' });
    }
  },
  updateStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      if (estado === 'iniciado') {
        const { rows } = await pool.query('SELECT direccion, hora_entrada FROM eventos WHERE id = $1', [id]);
        const evento = rows[0];
        if (!evento || !evento.direccion || !evento.hora_entrada) {
          return res.status(400).json({ error: 'Debe completar la dirección y hora de entrada antes de iniciar el evento' });
        }
      }

      await pool.query('UPDATE eventos SET estado = $1 WHERE id = $2', [estado, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  },
  updateExtras: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { personas_extras, horas_extras } = req.body;
    try {
      await pool.query('UPDATE eventos SET personas_extras = $1, horas_extras = $2 WHERE id = $3', [personas_extras || 0, horas_extras || 0, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update extras' });
    }
  },
  updatePagado: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { pagado } = req.body;
    try {
      await pool.query('UPDATE eventos SET pagado = $1 WHERE id = $2', [pagado ? true : false, id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update pagado status' });
    }
  },
  updatePagos: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { 
      abono_monto, abono_fecha, 
      pago_final_monto, pago_final_fecha,
      factura_base, factura_extras,
      pago_extras_monto, pago_extras_fecha 
    } = req.body;
    
    try {
      await pool.query(`
        UPDATE eventos SET 
          abono_monto = $1, abono_fecha = $2, 
          pago_final_monto = $3, pago_final_fecha = $4,
          factura_base = $5, factura_extras = $6,
          pago_extras_monto = $7, pago_extras_fecha = $8
        WHERE id = $9
      `, [
        abono_monto || 0, abono_fecha || null, 
        pago_final_monto || 0, pago_final_fecha || null,
        factura_base || null, factura_extras || null,
        pago_extras_monto || 0, pago_extras_fecha || null,
        id
      ]);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update pagos' });
    }
  }
};
