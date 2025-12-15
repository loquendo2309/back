const { Router } = require('express');
const CuponController = require('../controller/cupon.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const asyncHandler = require('../utils/async.handler');

// Manual Dependency Injection
const CuponService = require('../../application/use-cases/cupon.service');
const CuponMongoRepository = require('../../infrastructure/repositories/database/mongo/cupon.mongo.repository');

const cuponRepository = new CuponMongoRepository();
const cuponService = new CuponService(cuponRepository);
const cuponController = new CuponController(cuponService);

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cupon:
 *       type: object
 *       required:
 *         - codigo
 *         - descuento
 *         - fechaExpiracion
 *         - usoMaximo
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated coupon ID
 *         codigo:
 *           type: string
 *           description: Unique coupon code (uppercase)
 *         descuento:
 *           type: number
 *           description: Discount percentage (0-100)
 *           minimum: 0
 *           maximum: 100
 *         fechaExpiracion:
 *           type: string
 *           format: date
 *           description: Expiration date
 *         activo:
 *           type: boolean
 *           description: Active status
 *           default: true
 *         usoMaximo:
 *           type: number
 *           description: Maximum number of uses
 *           minimum: 1
 *         usoActual:
 *           type: number
 *           description: Current number of uses
 *           default: 0
 *       example:
 *         codigo: DESCUENTO10
 *         descuento: 10
 *         fechaExpiracion: 2026-12-31
 *         activo: true
 *         usoMaximo: 100
 */

/**
 * @swagger
 * tags:
 *   name: Cupons
 *   description: API for managing discount coupons
 */

/**
 * @swagger
 * /cupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.get('/', [authenticateToken, isAdmin], asyncHandler(cuponController.getAll));

/**
 * @swagger
 * /cupons/activos:
 *   get:
 *     summary: Get all active coupons
 *     tags: [Cupons]
 *     responses:
 *       200:
 *         description: List of active coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupon'
 */
router.get('/activos', asyncHandler(cuponController.getActivos));

/**
 * @swagger
 * /cupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.getById));

/**
 * @swagger
 * /cupons/codigo/{codigo}:
 *   get:
 *     summary: Get coupon by code
 *     tags: [Cupons]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon code
 *     responses:
 *       200:
 *         description: Coupon found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       404:
 *         description: Coupon not found
 */
router.get('/codigo/:codigo', asyncHandler(cuponController.getByCodigo));

/**
 * @swagger
 * /cupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cupon'
 *           example:
 *             codigo: NAVIDAD2025
 *             descuento: 25
 *             fechaExpiracion: 2026-01-15
 *             activo: true
 *             usoMaximo: 50
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 *       409:
 *         description: Conflict - coupon code already exists
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(cuponController.create));

/**
 * @swagger
 * /cupons/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cupon'
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.update));

/**
 * @swagger
 * /cupons/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       204:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.delete));

/**
 * @swagger
 * /cupons/{codigo}/usar:
 *   post:
 *     summary: Use a coupon (increment usage counter)
 *     tags: [Cupons]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon code
 *     responses:
 *       200:
 *         description: Coupon used successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request - coupon expired, inactive, or max uses reached
 *       404:
 *         description: Coupon not found
 */
router.post('/:codigo/usar', asyncHandler(cuponController.usar));

/**
 * @swagger
 * /cupons/{id}/deshabilitar:
 *   patch:
 *     summary: Disable a coupon
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request - coupon is already disabled
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.patch('/:id/deshabilitar', [authenticateToken, isAdmin], asyncHandler(cuponController.deshabilitar));

/**
 * @swagger
 * /cupons/{id}/habilitar:
 *   patch:
 *     summary: Enable a coupon
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request - coupon is already enabled
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin role
 */
router.patch('/:id/habilitar', [authenticateToken, isAdmin], asyncHandler(cuponController.habilitar));

module.exports = router;
