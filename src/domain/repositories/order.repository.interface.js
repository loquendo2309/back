class OrderRepository {
constructor() { if (this.constructor === OrderRepository) throw new Error('Cannot instantiate abstract class'); }
async getAll() { throw new Error("Method 'getAll()' must be implemented."); }
async getById(id) { throw new Error("Method 'getById(id)' must be implemented."); }
async create(orderEntity) { throw new Error("Method 'create(orderEntity)' must be implemented."); }
async update(id, orderEntity) { throw new Error("Method 'update(id, orderEntity)' must be implemented."); }
async delete(id) { throw new Error("Method 'delete(id)' must be implemented."); }
}
module.exports = OrderRepository;