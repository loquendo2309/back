class Cupon {
    constructor(id, codigo, descuento, fechaExpiracion, activo, usoMaximo, usoActual) {
        this.id = id;
        this.codigo = codigo; // Unique coupon code
        this.descuento = descuento; // Discount percentage (0-100)
        this.fechaExpiracion = fechaExpiracion; // Expiration date
        this.activo = activo; // Active status
        this.usoMaximo = usoMaximo; // Maximum number of uses
        this.usoActual = usoActual; // Current number of uses
    }
}

module.exports = Cupon;
