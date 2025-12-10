const request = require('supertest');
const app = require('../app'); // Assuming your express app is exported from app.js
const mongoose = require('mongoose');

describe('Product API', () => {
  describe('GET /api/v1/products', () => {
    it('should return 200 OK with an empty array when no products exist', async () => {
      const response = await request(app).get('/api/v1/products');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should return 200 OK with a list of products', async () => {
      // Arrange: Insert a product directly into the in-memory database
      const Product = mongoose.model('Product');
      await Product.create({
        name: 'Test Product',
        description: 'A product for testing',
        price: 100,
        stock: 10,
        category: 'Test Category', // Add required category field
        order: 1, // Add required order field
      });

      // Act: Make the API call
      const response = await request(app).get('/api/v1/products');

      // Assert: Check the response
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('Test Product');
    });
  });
});
