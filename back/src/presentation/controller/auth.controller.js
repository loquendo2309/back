const AuthService = require('../../application/use-cases/auth.service');
const UserMongoRepository = require('../../infrastructure/repositories/database/mongo/user.mongo.repository');
const { BadRequestError } = require('../../domain/errors');

const authService = new AuthService(new UserMongoRepository());

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }
        const result = await authService.login(email, password);
        res.status(200).json(result);
    }
}

module.exports = new AuthController();
