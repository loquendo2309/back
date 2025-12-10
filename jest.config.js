module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
};
