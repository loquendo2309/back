const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = server;
