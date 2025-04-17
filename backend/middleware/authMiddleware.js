const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Not authorized",
                success: false,
            });
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false,
            });
        }

        req.id = decoded.id;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = isAuthenticated;
