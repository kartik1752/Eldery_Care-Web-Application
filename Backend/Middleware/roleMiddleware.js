const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied for your role." });
        }
        next();
    };
};

module.exports = allowRoles;