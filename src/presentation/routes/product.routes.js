const { Router } = require('express');
const ProductController = require('../controller/product.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const asyncHandler = require('../utils/async.handler');

// Esta es la "Inyección de Dependencias" manual
const ProductService = require('../../application/use-cases/product.service');

const ProductMongoRepository = require('../../infrastructure/repositories/database/mongo/product.mongo.repository');
const productRepository = new ProductMongoRepository();

const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();
router.get('/', asyncHandler(productController.getAll));
router.get('/:id', asyncHandler(productController.getById));
router.post('/', [authenticateToken, isAdmin], asyncHandler(productController.create));
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(productController.update));
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(productController.delete));

module.exports = router;
