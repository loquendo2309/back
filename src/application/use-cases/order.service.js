const { Order, OrderItem } = require('../../domain/entities/order.entity');


class OrderService {
constructor(orderRepository) { this.orderRepository = orderRepository; }


computeItems(itemsInput = []) {
if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
throw new Error('Order must contain at least one item');
}
const items = itemsInput.map(i => {
if (!i.producto || i.producto.trim() === '') throw new Error('producto is required');
const cantidad = Number(i.cantidad);
const precio = Number(i.precio);
const descuento = Number(i.descuento || 0);
if (cantidad <= 0) throw new Error('cantidad must be > 0');
if (precio < 0) throw new Error('precio must be >= 0');
if (descuento < 0) throw new Error('descuento must be >= 0');
const total = (precio - descuento) * cantidad;
if (total < 0) throw new Error('Item total cannot be negative');
return new OrderItem(i.producto, i.descripcion, cantidad, precio, descuento, total);
});
return items;
}


async getAllOrders() { return this.orderRepository.getAll(); }
async getOrderById(id) { return this.orderRepository.getById(id); }


async createOrder(data) {
const items = this.computeItems(data.items);
const entity = new Order(null, items);
return this.orderRepository.create(entity);
}


async updateOrder(id, data) {
const items = this.computeItems(data.items);
const entity = new Order(id, items);
return this.orderRepository.update(id, entity);
}


async deleteOrder(id) { return this.orderRepository.delete(id); }
}


module.exports = OrderService;