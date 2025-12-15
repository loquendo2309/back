class Product {
    constructor(id, name, description, price, stock, category, marca, imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.marca = marca;
        this.imageUrl = imageUrl;
    }
}

module.exports = Product;