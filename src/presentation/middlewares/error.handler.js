const { BaseError } = require('../../domain/errors');

// Evita romper si por alguna razón BaseError no carga
const isBase = (err) => (typeof BaseError === 'function') && (err instanceof BaseError);

function errorHandler(err, req, res, next) {
  if (isBase(err)) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }

  // Mongoose comunes (opcional)
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key', details: err.keyValue });
  }
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', details: err.errors });
  }
  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format', details: { path: err.path, value: err.value } });
  }

  // Log y fallback
  console.error(err);
  return res.status(500).json({ message: 'An internal server error occurred' });
}

module.exports = errorHandler;
