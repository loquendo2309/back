const mongoose = require('mongoose');

const cuponSchema = new mongoose.Schema({
<<<<<<< HEAD
  id_user: { type: String, required: true, min: 0 },
=======
  id_user: { type: Number, required: true, min: 0 },
>>>>>>> c5778368225291703407cc32ab4ef64af94008c2
    init_date: { type: String, required: true },
    end_date: { type: String, required: true },
  value: { type: Number, required: true, min: 0 },
  
}, { timestamps: true });

module.exports = mongoose.model('Cupon', cuponSchema);