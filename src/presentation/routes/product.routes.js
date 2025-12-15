const { Router } = require('express');
const ProductController = require('../controller/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const asyncHandler = require('../utils/async.handler');

const ProductService = require('../../application/use-cases/product.service');
const ProductMongoRepository = require('../../infrastructure/repositories/database/mongo/product.mongo.repository');

const productRepository = new ProductMongoRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Gestión de productos (solo crear requiere JWT)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos los productos
 *     tags: [Products]
 *     security: []   # público, aunque exista seguridad global
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', asyncHandler(productController.getAll));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Products]
 *     security: []   # público
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', asyncHandler(productController.getById));
<<<<<<< HEAD

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (requiere JWT y rol admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []   # SOLO aquí se requiere token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (token faltante/ inválido)
 *       403:
 *         description: Forbidden (requiere admin)
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(productController.create));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto (público)
 *     tags: [Products]
 *     security: []   # público
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.put('/:id', asyncHandler(productController.update));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto (público)
 *     tags: [Products]
 *     security: []   # público
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Product not found
 */
router.delete('/:id', asyncHandler(productController.delete));
=======
//router.post('/', [authenticateToken, isAdmin], asyncHandler(productController.create));
router.post('/',  asyncHandler(productController.create));
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(productController.update));
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(productController.delete));
>>>>>>> c5778368225291703407cc32ab4ef64af94008c2

module.exports = router;
