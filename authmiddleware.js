// authMiddleware.js
const jwt = require('jsonwebtoken');

function ensureAuthenticated(req, res, next) {
    const token = req.cookies.token;  // Read the token from the request's cookies
    if (!token) {
        return res.status(401).send("Unauthorized: No token provided"); // If token not found
    }
    jwt.verify(token, "shhhh", (err, decoded) => {  // Verify the token
        if (err) {
            return res.status(403).send("Forbidden: Invalid token"); // If token is invalid
        }
        req.user = decoded;  // Store decoded user info in request
        next();  // Move to the next middleware/route
    });
}

module.exports = ensureAuthenticated;
