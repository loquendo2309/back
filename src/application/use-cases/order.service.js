const Order = require('../../domain/entities/order.entity');
const { NotFoundError } = require('../../domain/errors');

class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async getAllOrders() {
        return this.orderRepository.getAll();
    }

    async getOrderById(id) {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new NotFoundError(`Order with id ${id} not found`);
        }
        return order;
    }

    async getOrdersByEstado(estado) {
        const estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            throw new Error(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
        }
        return this.orderRepository.getByEstado(estado);
    }

    async createOrder(orderData) {
        // Validaciones de negocio
        if (orderData.cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        if (orderData.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        if (orderData.descuento < 0 || orderData.descuento > 100) {
            throw new Error('El descuento debe estar entre 0 y 100');
        }

        // Calcular el total
        const subtotal = orderData.precio * orderData.cantidad;
        const descuentoAmount = subtotal * (orderData.descuento / 100);
        const total = subtotal - descuentoAmount;

        // Validar fecha de entrega (no puede ser en el pasado)
        const fechaEntrega = new Date(orderData.fechaEntrega);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaEntrega < hoy) {
            throw new Error('La fecha de entrega no puede ser en el pasado');
        }

        const orderEntity = new Order(
            null,
            orderData.producto,
            orderData.descripcion,
            orderData.cantidad,
            orderData.precio,
            orderData.descuento || 0,
            total,
            orderData.cliente,
            orderData.estado || 'pendiente',
            fechaEntrega
        );

        return this.orderRepository.create(orderEntity);
    }

    async updateOrder(id, orderData) {
        const existingOrder = await this.orderRepository.getById(id);
        if (!existingOrder) {
            throw new NotFoundError(`Order with id ${id} not found`);
        }

        // Validaciones de negocio
        if (orderData.cantidad && orderData.cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        if (orderData.precio && orderData.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }

        if (orderData.descuento !== undefined && (orderData.descuento < 0 || orderData.descuento > 100)) {
            throw new Error('El descuento debe estar entre 0 y 100');
        }

        // Validar fecha de entrega si se proporciona
        if (orderData.fechaEntrega) {
            const fechaEntrega = new Date(orderData.fechaEntrega);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaEntrega < hoy) {
                throw new Error('La fecha de entrega no puede ser en el pasado');
            }
        }

        // Calcular el total con los datos actualizados o existentes
        const cantidad = orderData.cantidad || existingOrder.cantidad;
        const precio = orderData.precio || existingOrder.precio;
        const descuento = orderData.descuento !== undefined ? orderData.descuento : existingOrder.descuento;

        const subtotal = precio * cantidad;
        const descuentoAmount = subtotal * (descuento / 100);
        const total = subtotal - descuentoAmount;

        const orderEntity = new Order(
            id,
            orderData.producto || existingOrder.producto,
            orderData.descripcion || existingOrder.descripcion,
            cantidad,
            precio,
            descuento,
            total,
            orderData.cliente || existingOrder.cliente,
            orderData.estado || existingOrder.estado,
            orderData.fechaEntrega ? new Date(orderData.fechaEntrega) : existingOrder.fechaEntrega
        );

        return this.orderRepository.update(id, orderEntity);
    }

    async deleteOrder(id) {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new NotFoundError(`Order with id ${id} not found`);
        }
        return this.orderRepository.delete(id);
    }

    async cancelOrder(id) {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new NotFoundError(`Order with id ${id} not found`);
        }

        if (order.estado === 'entregado') {
            throw new Error('No se puede cancelar una orden que ya fue entregada');
        }

        if (order.estado === 'cancelado') {
            throw new Error('Esta orden ya está cancelada');
        }

        const orderEntity = new Order(
            id,
            order.producto,
            order.descripcion,
            order.cantidad,
            order.precio,
            order.descuento,
            order.total,
            order.cliente,
            'cancelado',
            order.fechaEntrega
        );

        return this.orderRepository.update(id, orderEntity);
    }
}

module.exports = OrderService;
