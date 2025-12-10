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
 *     description: Gestión de productos (todas requieren JWT)
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     AuthorizationHeader:
 *       in: header
 *       name: Authorization
 *       required: true
 *       schema:
 *         type: string
 *       description: "JWT en formato: Bearer <token>"
 *       example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "675f0d2e8f2b9a001234abcd"
 *         name:
 *           type: string
 *           example: "Teclado Mecánico"
 *         description:
 *           type: string
 *           example: "Switches azules, layout ES"
 *         price:
 *           type: number
 *           example: 50
 *         stock:
 *           type: number
 *           example: 100
 *         category:
 *           type: string
 *           example: "Periféricos"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/teclado.jpg"
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Teclado Mecánico"
 *         description:
 *           type: string
 *           example: "Switches azules, layout ES"
 *         price:
 *           type: number
 *           example: 50
 *         stock:
 *           type: number
 *           example: 100
 *         category:
 *           type: string
 *           example: "Periféricos"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/teclado.jpg"
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category
 */

// Todas las rutas requieren token; las de escritura además requieren admin
router.use(authenticateToken);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos los productos
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
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
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (requiere admin)
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Teclado Mecánico"
 *             description: "Switches azules, layout ES"
 *             price: 50
 *             stock: 100
 *             category: "Periféricos"
 *             imageUrl: "https://example.com/teclado.jpg"
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
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (se requiere admin)
 */
router.post('/', [isAdmin], asyncHandler(productController.create));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto (requiere admin)
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
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
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Teclado Mecánico"
 *             description: "Switches marrones, layout ES"
 *             price: 55
 *             stock: 80
 *             category: "Periféricos"
 *             imageUrl: "https://example.com/teclado-v2.jpg"
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.put('/:id', [isAdmin], asyncHandler(productController.update));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto (requiere admin)
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/AuthorizationHeader'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.delete('/:id', [isAdmin], asyncHandler(productController.delete));

module.exports = router;
