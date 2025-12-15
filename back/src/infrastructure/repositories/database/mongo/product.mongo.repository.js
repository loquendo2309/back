const ProductRepository = require('../../../../domain/repositories/product.repository.interface');
const ProductModel = require('./models/product.model');
const Product = require('../../../../domain/entities/product.entity');

class ProductMongoRepository extends ProductRepository {
    async getAll() {
        const products = await ProductModel.find();
        return products.map(p => new Product(p._id.toString(), p.name, p.description, p.price, p.stock, p.category, p.marca, p.imageUrl));
    }

    async getById(id) {
        const product = await ProductModel.findById(id);
        if (!product) return null;
        return new Product(product._id.toString(), product.name, product.description, product.price, product.stock, product.category, product.marca, product.imageUrl);
    }

    async create(productEntity) {
        const newProduct = new ProductModel({
            name: productEntity.name,
            description: productEntity.description,
            price: productEntity.price,
            stock: productEntity.stock,
            category: productEntity.category,
            marca: productEntity.marca,
            imageUrl: productEntity.imageUrl
        });
        const savedProduct = await newProduct.save();
        return new Product(savedProduct._id.toString(), savedProduct.name, savedProduct.description, savedProduct.price, savedProduct.stock, savedProduct.category, savedProduct.marca, savedProduct.imageUrl);
    }

    async update(id, productEntity) {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
            name: productEntity.name,
            description: productEntity.description,
            price: productEntity.price,
            stock: productEntity.stock,
            category: productEntity.category,
            marca: productEntity.marca,
            imageUrl: productEntity.imageUrl
        }, { new: true });

        if (!updatedProduct) return null;
        return new Product(updatedProduct._id.toString(), updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.stock, updatedProduct.category, updatedProduct.marca, updatedProduct.imageUrl);
    }

    async delete(id) {
        await ProductModel.findByIdAndDelete(id);
    }
}

module.exports = ProductMongoRepository;