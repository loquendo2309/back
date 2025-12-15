// Este archivo se ejecuta antes de todas las pruebas
// Configuración global para las pruebas

// Aumentar el timeout global para pruebas de integración con base de datos
jest.setTimeout(10000);

// Mock de variables de entorno para testing
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.PORT = 3001;
process.env.NODE_ENV = 'test';

// Opcional: Mock de console para reducir ruido en tests
global.console = {
    ...console,
    // Uncomment to ignore console logs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    error: console.error, // Keep errors visible
};
