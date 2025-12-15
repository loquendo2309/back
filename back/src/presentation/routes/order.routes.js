const { Router } = require('express');
const OrderController = require('../controller/order.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const asyncHandler = require('../utils/async.handler');

// Manual Dependency Injection
const OrderService = require('../../application/use-cases/order.service');
const OrderMongoRepository = require('../../infrastructure/repositories/database/mongo/order.mongo.repository');

const orderRepository = new OrderMongoRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - producto
 *         - descripcion
 *         - cantidad
 *         - precio
 *         - cliente
 *         - fechaEntrega
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la orden
 *         producto:
 *           type: string
 *           description: Nombre del producto de computadora
 *           enum: [Laptop HP Pavilion, Laptop Dell XPS, Laptop Lenovo ThinkPad, Laptop ASUS ROG, Monitor Samsung 27", Monitor LG UltraWide, Teclado Mecánico Logitech, Mouse Gamer Razer, Tarjeta Gráfica NVIDIA RTX 4090, Tarjeta Gráfica AMD Radeon RX 7900, Procesador Intel Core i9, Procesador AMD Ryzen 9, RAM Corsair 32GB DDR5, SSD Samsung 1TB NVMe, Motherboard ASUS ROG, Fuente de Poder 850W, Case Gamer RGB, Webcam Logitech HD, Auriculares HyperX Cloud, Impresora HP LaserJet]
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto
 *         cantidad:
 *           type: number
 *           description: Cantidad de productos
 *         precio:
 *           type: number
 *           description: Precio unitario del producto
 *         descuento:
 *           type: number
 *           description: Descuento en porcentaje (0-100)
 *           default: 0
 *         total:
 *           type: number
 *           description: Total calculado automáticamente
 *         cliente:
 *           type: string
 *           description: Nombre del cliente
 *         estado:
 *           type: string
 *           description: Estado de la orden
 *           enum: [pendiente, procesando, enviado, entregado, cancelado]
 *           default: pendiente
 *         fechaEntrega:
 *           type: string
 *           format: date
 *           description: Fecha estimada de entrega
 *       example:
 *         producto: Laptop Dell XPS
 *         descripcion: Laptop Dell XPS 15 con procesador Intel i7, 16GB RAM, 512GB SSD
 *         cantidad: 2
 *         precio: 1500
 *         descuento: 10
 *         cliente: Juan Pérez
 *         estado: pendiente
 *         fechaEntrega: 2025-12-20
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API para gestión de órdenes de productos de computadoras
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
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
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
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
 * /orders/estado/{estado}:
 *   get:
 *     summary: Obtener órdenes por estado
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, procesando, enviado, entregado, cancelado]
 *         required: true
 *         description: Estado de las órdenes
 *     responses:
 *       200:
 *         description: Lista de órdenes con el estado especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/estado/:estado', asyncHandler(orderController.getByEstado));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - requiere rol de administrador
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(orderController.create));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Actualizar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - requiere rol de administrador
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(orderController.update));

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Eliminar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       204:
 *         description: Orden eliminada exitosamente
 *       404:
 *         description: Orden no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - requiere rol de administrador
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(orderController.delete));

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - requiere rol de administrador
 */
router.patch('/:id/cancel', [authenticateToken, isAdmin], asyncHandler(orderController.cancel));

module.exports = router;
