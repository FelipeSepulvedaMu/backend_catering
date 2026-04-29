import { Router } from 'express';
import authController from '../controllers/auth';
import productorasController from '../controllers/productoras';
import contactosController from '../controllers/contactos';
import eventosController from '../controllers/eventos';
import gastosController from '../controllers/gastos';

const router = Router();

// Auth
router.post('/login', authController.login);

// Productoras
router.get('/productoras', productorasController.getAll);
router.post('/productoras', productorasController.create);

// Contactos
router.get('/contactos', contactosController.getAll);
router.post('/contactos', contactosController.create);

// Eventos
router.get('/eventos', eventosController.getAll);
router.get('/eventos/:id', eventosController.getById);
router.post('/eventos', eventosController.create);
router.put('/eventos/:id', eventosController.update);
router.patch('/eventos/:id/status', eventosController.updateStatus);
router.patch('/eventos/:id/extras', eventosController.updateExtras);
router.patch('/eventos/:id/reprogramar', eventosController.reprogramar);
router.patch('/eventos/:id/pagado', eventosController.updatePagado);
router.patch('/eventos/:id/pagos', eventosController.updatePagos);

// Gastos
router.get('/eventos/:evento_id/gastos', gastosController.getByEvento);
router.post('/eventos/:evento_id/gastos', gastosController.create);
router.delete('/gastos/:id', gastosController.delete);

export default router;
