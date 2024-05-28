const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');

// Validation rules
const userValidationRules = [
    check('fullname').notEmpty().withMessage('Fullname is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('mobile').isMobilePhone().withMessage('Invalid mobile number'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Routes
router.get('/users', authenticateJWT, userController.getAllUsers);
router.get('/user/:id', authenticateJWT, userController.getUserById);
router.post('/user', userValidationRules, userController.createUser);
router.put('/user/:id', userValidationRules, authenticateJWT, userController.updateUser);
router.delete('/user/:id', authenticateJWT, userController.deleteUser);

router.post('/register', userValidationRules, userController.register);
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required')
], userController.login);

router.get('/user/:id/products', authenticateJWT, userController.getProductsByUser);

module.exports = router;
