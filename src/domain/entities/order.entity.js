class OrderItem {
constructor(producto, descripcion, cantidad, precio, descuento, total) {
this.producto = producto;
this.descripcion = descripcion || '';
this.cantidad = cantidad;
this.precio = precio;
this.descuento = descuento || 0; // por unidad
this.total = total; // derivado: (precio - descuento) * cantidad
}
}


class Order {
constructor(id, items = []) {
this.id = id;
this.items = items; // Array<OrderItem>
}
}
module.exports = { Order, OrderItem };