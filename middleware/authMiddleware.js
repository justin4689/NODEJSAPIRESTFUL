const jwt = require('jsonwebtoken');
const JWT_SECRET = 'votre_clé_secrète_ici';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send("Token invalide.");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).send("Token requis.");
    }
};

module.exports = authenticateJWT;
