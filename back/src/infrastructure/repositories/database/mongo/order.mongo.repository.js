const OrderRepository = require('../../../../domain/repositories/order.repository.interface');
const OrderModel = require('./models/order.model');
const Order = require('../../../../domain/entities/order.entity');

class OrderMongoRepository extends OrderRepository {
    async getAll() {
        const orders = await OrderModel.find().sort({ createdAt: -1 });
        return orders.map(o => new Order(
            o._id.toString(),
            o.producto,
            o.descripcion,
            o.cantidad,
            o.precio,
            o.descuento,
            o.total,
            o.cliente,
            o.estado,
            o.fechaEntrega
        ));
    }

    async getById(id) {
        const order = await OrderModel.findById(id);
        if (!order) return null;
        return new Order(
            order._id.toString(),
            order.producto,
            order.descripcion,
            order.cantidad,
            order.precio,
            order.descuento,
            order.total,
            order.cliente,
            order.estado,
            order.fechaEntrega
        );
    }

    async create(orderEntity) {
        const newOrder = new OrderModel({
            producto: orderEntity.producto,
            descripcion: orderEntity.descripcion,
            cantidad: orderEntity.cantidad,
            precio: orderEntity.precio,
            descuento: orderEntity.descuento,
            total: orderEntity.total,
            cliente: orderEntity.cliente,
            estado: orderEntity.estado,
            fechaEntrega: orderEntity.fechaEntrega
        });
        const savedOrder = await newOrder.save();
        return new Order(
            savedOrder._id.toString(),
            savedOrder.producto,
            savedOrder.descripcion,
            savedOrder.cantidad,
            savedOrder.precio,
            savedOrder.descuento,
            savedOrder.total,
            savedOrder.cliente,
            savedOrder.estado,
            savedOrder.fechaEntrega
        );
    }

    async update(id, orderEntity) {
        // Recalcular el total
        const subtotal = orderEntity.precio * orderEntity.cantidad;
        const descuentoAmount = subtotal * (orderEntity.descuento / 100);
        const total = subtotal - descuentoAmount;

        const updatedOrder = await OrderModel.findByIdAndUpdate(id, {
            producto: orderEntity.producto,
            descripcion: orderEntity.descripcion,
            cantidad: orderEntity.cantidad,
            precio: orderEntity.precio,
            descuento: orderEntity.descuento,
            total: total,
            cliente: orderEntity.cliente,
            estado: orderEntity.estado,
            fechaEntrega: orderEntity.fechaEntrega
        }, { new: true });

        if (!updatedOrder) return null;
        return new Order(
            updatedOrder._id.toString(),
            updatedOrder.producto,
            updatedOrder.descripcion,
            updatedOrder.cantidad,
            updatedOrder.precio,
            updatedOrder.descuento,
            updatedOrder.total,
            updatedOrder.cliente,
            updatedOrder.estado,
            updatedOrder.fechaEntrega
        );
    }

    async delete(id) {
        await OrderModel.findByIdAndDelete(id);
    }

    async getByEstado(estado) {
        const orders = await OrderModel.find({ estado }).sort({ createdAt: -1 });
        return orders.map(o => new Order(
            o._id.toString(),
            o.producto,
            o.descripcion,
            o.cantidad,
            o.precio,
            o.descuento,
            o.total,
            o.cliente,
            o.estado,
            o.fechaEntrega
        ));
    }
}

module.exports = OrderMongoRepository;
