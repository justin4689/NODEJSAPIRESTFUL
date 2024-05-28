const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateJWT = require('../middleware/authMiddleware');

// Routes protégées
router.get('/', authenticateJWT, productController.getAllProducts);
router.get('/:id', authenticateJWT, productController.getProductById);
router.post('/', authenticateJWT, productController.createProduct);
router.put('/:id', authenticateJWT, productController.updateProduct);
router.delete('/:id', authenticateJWT, productController.deleteProduct);

module.exports = router;
