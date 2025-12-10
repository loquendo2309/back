require('dotenv').config();
const PORT = process.env.PORT || 8080;

const express = require('express');
const morgan = require('morgan');
const { connectDB } = require('./src/infrastructure/repositories/database/mongo/config');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/presentation/swagger.config');

const app = express();

// Conexión a DB
connectDB();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Rutas
const productRoutes = require('./src/presentation/routes/product.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const roleRoutes = require('./src/presentation/routes/role.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const orderRoutes = require('./src/presentation/routes/order.routes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);

// Healthcheck
app.get('/api/v1/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Swagger UI (con persistencia de autorización)
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // mantiene el token al recargar
    },
  })
);

// Error handler (al final de la cadena)
const errorHandler = require('./src/presentation/middlewares/error.handler');
app.use(errorHandler);

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
