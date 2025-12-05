const OrderRepository = require('../../../../domain/repositories/order.repository.interface');
const OrderModel = require('./models/order.model');
const { Order, OrderItem } = require('../../../../domain/entities/order.entity');


function mapDocToEntity(doc) {
if (!doc) return null;
const items = (doc.items || []).map(i => new OrderItem(
i.producto, i.descripcion, i.cantidad, i.precio, i.descuento, i.total
));
return new Order(doc._id.toString(), items);
}


class OrderMongoRepository extends OrderRepository {
async getAll() {
const docs = await OrderModel.find().sort({ createdAt: -1 });
return docs.map(mapDocToEntity);
}


async getById(id) {
const doc = await OrderModel.findById(id);
return mapDocToEntity(doc);
}


async create(orderEntity) {
const payload = {
items: orderEntity.items.map(i => ({
producto: i.producto,
descripcion: i.descripcion,
cantidad: i.cantidad,
precio: i.precio,
descuento: i.descuento,
total: i.total,
}))
};
const saved = await OrderModel.create(payload);
return mapDocToEntity(saved);
}


async update(id, orderEntity) {
const update = {
items: orderEntity.items.map(i => ({
producto: i.producto,
descripcion: i.descripcion,
cantidad: i.cantidad,
precio: i.precio,
descuento: i.descuento,
total: i.total,
}))
};
const doc = await OrderModel.findByIdAndUpdate(id, update, { new: true });
return doc ? mapDocToEntity(doc) : null;
}


async delete(id) { await OrderModel.findByIdAndDelete(id); }
}


module.exports = OrderMongoRepository;