const mongoose = require('mongoose');

const cuponSchema = new mongoose.Schema({
  id_user: { type: String, required: true, min: 0 },
    init_date: { type: String, required: true },
    end_date: { type: String, required: true },
  value: { type: Number, required: true, min: 0 },
  
}, { timestamps: true });

module.exports = mongoose.model('Cupon', cuponSchema);