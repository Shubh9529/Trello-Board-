const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    try {
        const decoded = jwt.verify(
            token,
            "demonsgroup12345password"
        );

        console.log("Decoded:", decoded);

        req.userId = decoded.userId;
        next();

    } catch (err) {
        console.log("JWT Error:", err);

        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    authMiddleware
};