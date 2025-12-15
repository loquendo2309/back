const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../../domain/errors');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async login(email, password) {
        const user = await this.userRepository.getByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // the user object from the repository might have the full role objects
        // we need to extract role names for the token
        const roles = user.roles.map(role => role.name);

        const payload = { 
            id: user.id, 
            roles: roles // take care of roles extraction they are in the payloads
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: roles
            }
        };
    }
}

module.exports = AuthService;
