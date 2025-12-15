const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'Laptop HP Pavilion',
      'Laptop Dell XPS',
      'Laptop Lenovo ThinkPad',
      'Laptop ASUS ROG',
      'Monitor Samsung 27"',
      'Monitor LG UltraWide',
      'Teclado Mecánico Logitech',
      'Mouse Gamer Razer',
      'Tarjeta Gráfica NVIDIA RTX 4090',
      'Tarjeta Gráfica AMD Radeon RX 7900',
      'Procesador Intel Core i9',
      'Procesador AMD Ryzen 9',
      'RAM Corsair 32GB DDR5',
      'SSD Samsung 1TB NVMe',
      'Motherboard ASUS ROG',
      'Fuente de Poder 850W',
      'Case Gamer RGB',
      'Webcam Logitech HD',
      'Auriculares HyperX Cloud',
      'Impresora HP LaserJet'
    ]
  },
  descripcion: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} debe ser un número entero'
    }
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  descuento: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'El descuento debe estar entre 0 y 100'
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  cliente: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  fechaEntrega: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
