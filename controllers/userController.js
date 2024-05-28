const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens JWT
const JWT_SECRET = 'votre_clé_secrète_ici';

exports.register = (req, res) => {
    const { fullname, email, mobile, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!fullname || !email || !mobile || !password) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Erreur lors du hachage du mot de passe.");
        }

        const newUser = new User(null, fullname, email, mobile, hashedPassword);

        User.createUser(newUser, (err, user) => {
            if (err) {
                return res.status(500).send("Erreur lors de la création de l'utilisateur.");
            }
            res.status(201).json({ id: user.id, fullname: user.fullname, email: user.email, mobile: user.mobile });
        });
    });
};

// Méthode pour récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération des utilisateurs.");
        }
        res.json(users);
    });
};

// Méthode pour récupérer un utilisateur par son identifiant
exports.getUserById = (req, res) => {
    const userId = req.params.id;
    User.getUserById(userId, (err, user) => {
        if (err) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        res.json(user);
    });
};

// Méthode pour créer un nouvel utilisateur
exports.createUser = (req, res) => {
    const { fullname, email, mobile, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    if (!fullname || !email || !mobile || !password) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Erreur lors du hachage du mot de passe.");
        }

        User.createUser(fullname, email, mobile, hashedPassword, (err, newUser) => {
            if (err) {
                return res.status(500).send("Erreur lors de la création de l'utilisateur.");
            }
            res.status(201).json(newUser);
        });
    });
};

// Méthode pour mettre à jour un utilisateur existant
exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { fullname, email, mobile, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!fullname || !email || !mobile || !password) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Erreur lors du hachage du mot de passe.");
        }

        User.updateUser(userId, fullname, email, mobile, hashedPassword, (err, updatedUser) => {
            if (err) {
                return res.status(404).send("Utilisateur non trouvé.");
            }
            res.json(updatedUser);
        });
    });
};

// Méthode pour supprimer un utilisateur
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    User.deleteUser(userId, (err, result) => {
        if (err) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        res.status(200).send(result);
    });
};


exports.login = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!email || !password) {
        return res.status(400).send("Email et mot de passe sont requis.");
    }

    User.getUserByEmail(email, (err, user) => {
        if (err || !user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send("Mot de passe incorrect.");
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    });
};
// Méthode pour récupérer les produits associés à un utilisateur
exports.getProductsByUser = (req, res) => {
    const userId = req.params.id;
    User.getUserById(userId, (err, user) => {
        if (err) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        user.getProducts((err, products) => {
            if (err) {
                return res.status(500).send("Erreur lors de la récupération des produits.");
            }
            res.json(products);
        });
    });
};
