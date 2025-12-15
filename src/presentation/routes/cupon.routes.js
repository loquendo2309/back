const { Router } = require('express');
const CuponController = require('../controller/cupon.controller');
const asyncHandler = require('../utils/async.handler');

// DI manual
const CuponService = require('../../application/use-cases/cupon.service');
const CuponMongoRepository = require('../../infrastructure/repositories/database/mongo/cupon.mongo.repository');

const cuponRepository = new CuponMongoRepository();
const cuponService = new CuponService(cuponRepository);
const cuponController = new CuponController(cuponService);

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Cupons
 *     description: Gestión de cupones (todas las operaciones son públicas)
 */

/**
 * @swagger
 * /cupons:
 *   get:
 *     summary: Lista todos los cupones
 *     tags: [Cupons]
 *     security: []  # público
 *     responses:
 *       200:
 *         description: Lista de cupones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cupon'
 */
router.get('/', asyncHandler(cuponController.getAll));

/**
 * @swagger
 * /cupons/{id}:
 *   get:
 *     summary: Obtiene un cupón por ID
 *     tags: [Cupons]
 *     security: []  # público
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cupón encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       404:
 *         description: Cupon not found
 */
router.get('/:id', asyncHandler(cuponController.getById));
<<<<<<< HEAD

/**
 * @swagger
 * /cupons:
 *   post:
 *     summary: Crea un nuevo cupón
 *     tags: [Cupons]
 *     security: []  # público
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuponInput'
 *           example:
 *             id_user: "60c72b2f9b1e8a001f8e4caa"
 *             init_date: "2025-01-01T00:00:00.000Z"
 *             end_date: "2025-12-31T23:59:59.000Z"
 *             value: 25
 *     responses:
 *       201:
 *         description: Cupón creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       400:
 *         description: Bad request
 */
router.post('/', asyncHandler(cuponController.create));

/**
 * @swagger
 * /cupons/{id}:
 *   put:
 *     summary: Actualiza un cupón
 *     tags: [Cupons]
 *     security: []  # público
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CuponInput'
 *           example:
 *             id_user: "60c72b2f9b1e8a001f8e4caa"
 *             init_date: "2025-02-01T00:00:00.000Z"
 *             end_date: "2025-12-31T23:59:59.000Z"
 *             value: 30
 *     responses:
 *       200:
 *         description: Cupón actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cupon'
 *       404:
 *         description: Cupon not found
 */
router.put('/:id', asyncHandler(cuponController.update));

/**
 * @swagger
 * /cupons/{id}:
 *   delete:
 *     summary: Elimina un cupón
 *     tags: [Cupons]
 *     security: []  # público
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Cupon not found
 */
router.delete('/:id', asyncHandler(cuponController.delete));
=======
//router.post('/', [authenticateToken, isAdmin], asyncHandler(cuponController.create));
router.post('/',  asyncHandler(cuponController.create));
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.update));
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.delete));
>>>>>>> c5778368225291703407cc32ab4ef64af94008c2

module.exports = router;
