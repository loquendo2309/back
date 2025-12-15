const mongoose = require('mongoose');

const cuponSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  descuento: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: 'Discount must be between 0 and 100'
    }
  },
  fechaExpiracion: {
    type: Date,
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  usoMaximo: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'usoMaximo must be an integer'
    }
  },
  usoActual: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'usoActual must be an integer'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Cupon', cuponSchema);
