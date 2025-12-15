class ProductRepository {
    constructor() {
        if (this.constructor === ProductRepository) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    async getAll() {
        throw new Error("Method 'getAll()' must be implemented.");
    }

    async getById(id) {
        throw new Error("Method 'getById()' must be implemented.");
    }

    async create(product) {
        throw new Error("Method 'create()' must be implemented.");
    }

    async update(id, product) {
        throw new Error("Method 'update()' must be implemented.");
    }

    async delete(id) {
        throw new Error("Method 'delete()' must be implemented.");
    }
}

module.exports = ProductRepository;