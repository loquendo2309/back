const mongoose = require('mongoose');


const orderItemSchema = new mongoose.Schema({
producto: { type: String, required: true, trim: true },
descripcion: { type: String, default: '' },
cantidad: { type: Number, required: true, min: 1 },
precio: { type: Number, required: true, min: 0 },
descuento: { type: Number, default: 0, min: 0 }, // por unidad
total: { type: Number, required: true, min: 0 }, // derivado
}, { _id: false });


const orderSchema = new mongoose.Schema({
items: { type: [orderItemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);