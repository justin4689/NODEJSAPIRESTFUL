// controllers/productController.js
const Product = require('../models/productModel');

exports.getAllProducts = (req, res) => {
    Product.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération des produits.");
        }
        res.json(products);
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    Product.getProductById(productId, (err, product) => {
        if (err) {
            return res.status(404).send("Produit non trouvé.");
        }
        res.json(product);
    });
};

exports.createProduct = (req, res) => {
    const { name, price, description } = req.body;
    Product.createProduct(name, price, description, (err, newProduct) => {
        if (err) {
            return res.status(500).send("Erreur lors de la création du produit.");
        }
        res.status(201).json(newProduct);
    });
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;
    Product.updateProduct(productId, name, price, description, (err, updatedProduct) => {
        if (err) {
            return res.status(404).send("Produit non trouvé.");
        }
        res.json(updatedProduct);
    });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    Product.deleteProduct(productId, (err, result) => {
        if (err) {
            return res.status(404).send("Produit non trouvé.");
        }
        res.status(200).send(result);
    });
};
