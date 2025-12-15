class RoleRepository {
    constructor() {
        if (this.constructor === RoleRepository) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    async getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    async getById(id) {
        throw new Error("Method 'getById()' must be implemented.");
    }

    async create(role) {
        throw new Error("Method 'create()' must be implemented.");
    }

    async update(id, role) {
        throw new Error("Method 'update()' must be implemented.");
    }

    async delete(id) {
        throw new Error("Method 'delete()' must be implemented.");
    }

    async getByName(name) {
        throw new Error("Method 'getByName()' must be implemented.");
    }
}

module.exports = RoleRepository;
