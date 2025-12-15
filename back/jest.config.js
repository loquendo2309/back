module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/infrastructure/repositories/database/mongo/models/*.js',
        '!**/node_modules/**'
    ],
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js'
    ],
    verbose: true,
    testTimeout: 10000,
    coverageReporters: ['text', 'lcov', 'html'],
    moduleFileExtensions: ['js', 'json']
};
