// models/productModel.js
const db = require('./db');

class Product {
    constructor(id, name, price, description, userId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.userId = userId;
    }


    static getAllProducts(callback) {
        const qr = 'SELECT * FROM product';
        db.query(qr, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            const products = result.map(row => new Product(row.id, row.name, row.price, row.description));
            callback(null, products);
        });
    }

    static getProductById(productId, callback) {
        const qr = 'SELECT * FROM product WHERE id = ?';
        db.query(qr, [productId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.length === 0) {
                return callback(new Error('Produit non trouvé'), null);
            }
            const product = new Product(result[0].id, result[0].name, result[0].price, result[0].description);
            callback(null, product);
        });
    }

    static createProduct(name, price, description, callback) {
        const qr = 'INSERT INTO product (name, price, description) VALUES (?, ?, ?)';
        db.query(qr, [name, price, description], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            const newProduct = new Product(result.insertId, name, price, description);
            callback(null, newProduct);
        });
    }

    static updateProduct(productId, name, price, description, callback) {
        const qr = 'UPDATE product SET name = ?, price = ?, description = ? WHERE id = ?';
        db.query(qr, [name, price, description, productId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.affectedRows === 0) {
                return callback(new Error('Produit non trouvé'), null);
            }
            const updatedProduct = new Product(productId, name, price, description);
            callback(null, updatedProduct);
        });
    }

    static deleteProduct(productId, callback) {
        const qr = 'DELETE FROM product WHERE id = ?';
        db.query(qr, [productId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.affectedRows === 0) {
                return callback(new Error('Produit non trouvé'), null);
            }
            callback(null, { message: 'Produit supprimé avec succès' });
        });
    }
}

module.exports = Product;
