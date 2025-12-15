const { Router } = require('express');
const asyncHandler = require('../utils/async.handler');

// DI repos
const OrderMongoRepository = require('../../infrastructure/repositories/database/mongo/order.mongo.repository');
const UserMongoRepository = require('../../infrastructure/repositories/database/mongo/user.mongo.repository');
const ProductMongoRepository = require('../../infrastructure/repositories/database/mongo/product.mongo.repository');
const CuponMongoRepository = require('../../infrastructure/repositories/database/mongo/cupon.mongo.repository');

const OrderService = require('../../application/use-cases/order.service');
const OrderController = require('../controller/order.controller');

const orderRepo = new OrderMongoRepository();
const userRepo = new UserMongoRepository();
const productRepo = new ProductMongoRepository();
const cuponRepo = new CuponMongoRepository();

const orderService = new OrderService(orderRepo, userRepo, productRepo, cuponRepo);
const orderController = new OrderController(orderService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear una orden (no descuenta stock)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *           example:
 *             userId: "60c72b2f9b1e8a001f8e4caa"
 *             cuponId: "66b2b1d29d7e8a001f8e4001"
 *             items:
 *               - productId: "65d72b2f9b1e8a001f8e4555"
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Orden creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos inválidos o stock insuficiente
 */
router.post('/', asyncHandler(orderController.create));

/**
 * @swagger
 * /orders/{id}/pay:
 *   post:
 *     tags: [Orders]
 *     summary: Marcar una orden como pagada (descuenta stock)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Orden pagada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       409:
 *         description: Stock insuficiente al momento del pago
 */
router.post('/:id/pay', asyncHandler(orderController.pay));

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     tags: [Orders]
 *     summary: Cancelar una orden (si estaba pagada repone stock; si estaba pendiente solo cambia estado)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Orden cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 */
router.post('/:id/cancel', asyncHandler(orderController.cancel));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Obtener una orden por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: La orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', asyncHandler(orderController.getById));

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     tags: [Orders]
 *     summary: Listar órdenes por usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/user/:userId', asyncHandler(orderController.listByUser));

module.exports = router;
