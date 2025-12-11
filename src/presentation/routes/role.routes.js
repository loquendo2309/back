const { Router } = require('express');
const RoleController = require('../controller/role.controller');
const RoleService = require('../../application/use-cases/role.service');
const RoleMongoRepository = require('../../infrastructure/repositories/database/mongo/role.mongo.repository');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const asyncHandler = require('../utils/async.handler');

const roleRepository = new RoleMongoRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

const router = Router();
router.get('/', [authenticateToken, isAdmin], asyncHandler(roleController.getAll));
router.get('/:id', [authenticateToken, isAdmin], asyncHandler(roleController.getById));
router.post('/', [authenticateToken, isAdmin], asyncHandler(roleController.create));
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(roleController.update));
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(roleController.delete));

module.exports = router;
