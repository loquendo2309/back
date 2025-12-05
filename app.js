require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { connectDB } = require('./src/infrastructure/repositories/database/mongo/config');
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Connect to Database
connectDB();

// Middlewares
app.use(morgan('dev')); 
app.use(express.json()); 

// Routes
const productRoutes = require('./src/presentation/routes/product.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const roleRoutes = require('./src/presentation/routes/role.routes');
const authRoutes = require('./src/presentation/routes/auth.routes'); // Importar rutas de autenticación
const orderRoutes = require('./src/presentation/routes/order.routes');  
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/presentation/swagger.config');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/auth', authRoutes); // Usar rutas de autenticación
app.use('/api/v1/orders', orderRoutes);

console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);

// Healthcheck Endpoint (para probar)
app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
