"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const productoras_1 = __importDefault(require("../controllers/productoras"));
const contactos_1 = __importDefault(require("../controllers/contactos"));
const eventos_1 = __importDefault(require("../controllers/eventos"));
const gastos_1 = __importDefault(require("../controllers/gastos"));
const router = (0, express_1.Router)();
// Auth
router.post('/login', auth_1.default.login);
// Productoras
router.get('/productoras', productoras_1.default.getAll);
router.post('/productoras', productoras_1.default.create);
// Contactos
router.get('/contactos', contactos_1.default.getAll);
router.post('/contactos', contactos_1.default.create);
// Eventos
router.get('/eventos', eventos_1.default.getAll);
router.get('/eventos/:id', eventos_1.default.getById);
router.post('/eventos', eventos_1.default.create);
router.put('/eventos/:id', eventos_1.default.update);
router.patch('/eventos/:id/status', eventos_1.default.updateStatus);
router.patch('/eventos/:id/extras', eventos_1.default.updateExtras);
router.patch('/eventos/:id/reprogramar', eventos_1.default.reprogramar);
router.patch('/eventos/:id/pagado', eventos_1.default.updatePagado);
router.patch('/eventos/:id/pagos', eventos_1.default.updatePagos);
// Gastos
router.get('/eventos/:evento_id/gastos', gastos_1.default.getByEvento);
router.post('/eventos/:evento_id/gastos', gastos_1.default.create);
router.delete('/gastos/:id', gastos_1.default.delete);
exports.default = router;
