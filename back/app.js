require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { connectDB } = require('./src/infrastructure/repositories/database/mongo/config');
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(morgan('dev')); 
app.use(express.json()); 

// Routes
const productRoutes = require('./src/presentation/routes/product.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const roleRoutes = require('./src/presentation/routes/role.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const orderRoutes = require('./src/presentation/routes/order.routes');
const cuponRoutes = require('./src/presentation/routes/cupon.routes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cupons', cuponRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/presentation/swagger.config');

// Healthcheck Endpoint
app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const errorHandler = require('./src/presentation/middlewares/error.handler');
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
