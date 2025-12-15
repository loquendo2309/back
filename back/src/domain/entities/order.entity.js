class Order {
    constructor(id, producto, descripcion, cantidad, precio, descuento, total, cliente, estado, fechaEntrega) {
        this.id = id;
        this.producto = producto; // Nombre del producto de computadora
        this.descripcion = descripcion; // Descripcion detallada del producto
        this.cantidad = cantidad; // Cantidad de productos
        this.precio = precio; // Precio unitario
        this.descuento = descuento; // Descuento en porcentaje (0-100)
        this.total = total; // Total calculado
        this.cliente = cliente; // Nombre del cliente
        this.estado = estado; // Estado de la orden: 'pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'
        this.fechaEntrega = fechaEntrega; // Fecha estimada de entrega
    }
}

module.exports = Order;
