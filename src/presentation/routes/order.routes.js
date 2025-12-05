const { Router } = require('express');
const OrderController = require('../controller/order.controller');
const authenticateToken = require('../middlewares/auth.middleware'); // solo token
const asyncHandler = require('../utils/async.handler');

const OrderService = require('../../application/use-cases/order.service');
const OrderMongoRepository = require('../../infrastructure/repositories/database/mongo/order.mongo.repository');

const orderRepository = new OrderMongoRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

// Protege todo el router con JWT (sin verificación de rol)
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: CRUD de órdenes (requiere autenticación por token)
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         producto:
 *           type: string
 *           example: "Teclado Mecánico"
 *         descripcion:
 *           type: string
 *           example: "Switches azules, layout ES"
 *         cantidad:
 *           type: number
 *           example: 2
 *         precio:
 *           type: number
 *           example: 50
 *         descuento:
 *           type: number
 *           example: 5
 *         total:
 *           type: number
 *           description: Derivado = (precio - descuento) * cantidad
 *           example: 90
 *       required: [producto, cantidad, precio]
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "675f0d2e8f2b9a001234abcd"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *       required: [items]
 *     OrderInput:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               producto: { type: string, example: "Teclado Mecánico" }
 *               descripcion: { type: string, example: "Switches azules" }
 *               cantidad: { type: number, example: 2 }
 *               precio: { type: number, example: 50 }
 *               descuento: { type: number, example: 5 }
 *               total:
 *                 type: number
 *                 description: permitido en input pero el backend lo recalcula
 *                 example: 90
 *             required: [producto, cantidad, precio]
 *       required: [items]
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todas las órdenes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', asyncHandler(orderController.getAll));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get('/:id', asyncHandler(orderController.getById));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *           example:
 *             items:
 *               - producto: "Teclado Mecánico"
 *                 descripcion: "Switches azules, layout ES"
 *                 cantidad: 2
 *                 precio: 50
 *                 descuento: 5
 *               - producto: "Mouse Gamer"
 *                 descripcion: "RGB"
 *                 cantidad: 1
 *                 precio: 30
 *                 descuento: 0
 *     responses:
 *       201:
 *         description: Orden creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request (validación)
 */
router.post('/', asyncHandler(orderController.create));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualiza una orden existente
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Orden actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.put('/:id', asyncHandler(orderController.update));

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Elimina una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Order not found
 */
router.delete('/:id', asyncHandler(orderController.delete));

module.exports = router;
