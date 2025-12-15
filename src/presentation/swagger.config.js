const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentation for the API',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8080}/api/v1`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      // Opcional: permite documentar el header Authorization como apiKey
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      }
    },
    parameters: {
      AuthorizationHeader: {
        in: 'header',
        name: 'Authorization',
        required: true,
        schema: { type: 'string' },
        description: 'JWT en formato: Bearer <token>',
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      }
    },
    schemas: {
      // ===== Users =====
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1e8a001f8e4caa' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'jhon.doe@example.com' },
          roles: { type: 'array', items: { type: 'string' }, example: ['user'] }
        }
      },
      UserInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'jhon.doe@exmaple.com' },
          password: { type: 'string', example: 'password123' },
          roles: { type: 'array', items: { type: 'string' }, example: ['user'] }
        }
      },

      // ===== Products =====
      Product: {
        type: 'object',
        properties: {
          id:         { type: 'string', example: '675f0d2e8f2b9a001234abcd' },
          name:       { type: 'string', example: 'Teclado Mecánico' },
          description:{ type: 'string', example: 'Switches azules, layout ES' },
          price:      { type: 'number', example: 50 },
          stock:      { type: 'number', example: 100 },
          category:   { type: 'string', example: 'Periféricos' },
          brand:      { type: 'string', example: 'MiMarca' },
          imageUrl:   { type: 'string', example: 'https://example.com/teclado.jpg' }
        },
        required: ['id','name','price','stock']
      },
      ProductInput: {
        type: 'object',
        properties: {
          name:       { type: 'string', example: 'Teclado Mecánico' },
          description:{ type: 'string', example: 'Switches azules, layout ES' },
          price:      { type: 'number', minimum: 0, example: 50 },
          stock:      { type: 'number', minimum: 0, example: 100 },
          category:   { type: 'string', example: 'Periféricos' },
          brand:      { type: 'string', example: 'MiMarca' },
          imageUrl:   { type: 'string', example: 'https://example.com/teclado.jpg' }
        },
        required: ['name','description','price','stock','category']
      }
    }
  },
 Cupon: {
  type: 'object',
  properties: {
    id:        { type: 'string', example: '675f0d2e8f2b9a001234abcd' },
    id_user:   { type: 'string', example: '60c72b2f9b1e8a001f8e4caa' },
    init_date: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
    end_date:  { type: 'string', format: 'date-time', example: '2025-12-31T23:59:59.000Z' },
    value:     { type: 'number', example: 25 }
  },
  required: ['id','id_user','init_date','end_date','value']
},
CuponInput: {
  type: 'object',
  properties: {
    id_user:   { type: 'string' },
    init_date: { type: 'string', format: 'date-time' },
    end_date:  { type: 'string', format: 'date-time' },
    value:     { type: 'number', minimum: 0 }
  },
  required: ['id_user','init_date','end_date','value']
},
  // Seguridad global: todas las rutas requieren JWT (persistAuthorization en Swagger UI ayuda)
  security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
