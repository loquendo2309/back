const Role = require('../../domain/entities/role.entity');
const { ConflictError, NotFoundError } = require('../../domain/errors');

class RoleService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    
    async getAllRoles() {
        return this.roleRepository.getAll();
    }

    async getRoleById(id) {
        const role = await this.roleRepository.getById(id);
        if (!role) {
            throw new NotFoundError(`Role with id ${id} not found`);
        }
        return role;
    }

    async createRole(roleData) {
        const roleEntity = new Role(
            null,
            roleData.name
        );
        const existingRole = await this.roleRepository.getByName(roleData.name);
        if (existingRole) {
            throw new ConflictError('Role already exists');
        }
        return this.roleRepository.create(roleEntity);
    }

    async updateRole(id, roleData) {
        const existingRole = await this.roleRepository.getById(id);
        if (!existingRole) {
            throw new NotFoundError(`Role with id ${id} not found`);
        }
        const roleEntity = new Role(
            id,
            roleData.name
        );
        return this.roleRepository.update(id, roleEntity);
    }

    async deleteRole(id) {
        const role = await this.roleRepository.getById(id);
        if (!role) {
            throw new NotFoundError(`Role with id ${id} not found`);
        }
        return this.roleRepository.delete(id);
    }
}
module.exports = RoleService;
