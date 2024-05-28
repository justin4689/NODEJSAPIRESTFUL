// models/userModel.js
const db = require('./db');
const Product = require('./productModel');

class User {
    constructor(id, fullname, email, mobile, password) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
    }

    static getAllUsers(callback) {
        const qr = 'SELECT * FROM user';
        db.query(qr, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            const users = result.map(row => new User(row.id, row.fullname, row.email, row.mobile, row.password));
            callback(null, users);
        });
    }

    static getUserById(userId, callback) {
        const qr = 'SELECT * FROM user WHERE id = ?';
        db.query(qr, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.length === 0) {
                return callback(new Error('Utilisateur non trouvé'), null);
            }
            const user = new User(result[0].id, result[0].fullname, result[0].email, result[0].mobile, result[0].password);
            callback(null, user);
        });
    }

    static createUser(newUser, callback) {
        const qr = 'INSERT INTO user (fullname, email, mobile, password) VALUES (?, ?, ?, ?)';
        db.query(qr, [newUser.fullname, newUser.email, newUser.mobile, newUser.password], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            newUser.id = result.insertId;
            callback(null, newUser);
        });
    }

    static getUserByEmail(email, callback) {
        const qr = 'SELECT * FROM user WHERE email = ?';
        db.query(qr, [email], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            if (result.length === 0) {
                return callback(null, null);
            }
            const user = new User(result[0].id, result[0].fullname, result[0].email, result[0].mobile, result[0].password);
            callback(null, user);
        });
    }

    static updateUser(userId, fullname, email, mobile, callback) {
        const qr = 'UPDATE user SET fullname = ?, email = ?, mobile = ? WHERE id = ?';
        db.query(qr, [fullname, email, mobile, userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.affectedRows === 0) {
                return callback(new Error('Utilisateur non trouvé'), null);
            }
            const updatedUser = new User(userId, fullname, email, mobile);
            callback(null, updatedUser);
        });
    }

    static deleteUser(userId, callback) {
        const qr = 'DELETE FROM user WHERE id = ?';
        db.query(qr, [userId], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            if (result.affectedRows === 0) {
                return callback(new Error('Utilisateur non trouvé'), null);
            }
            callback(null, { message: 'Utilisateur supprimé avec succès' });
        });
    }

    getProducts(callback) {
        const qr = 'SELECT * FROM product WHERE user_id = ?';
        db.query(qr, [this.id], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            const products = result.map(row => new Product(row.id, row.name, row.price, row.description));
            callback(null, products);
        });
    }
}

module.exports = User;
