function isAdmin(req, res, next) {
    // this middleware must run AFTER authenticateToken
    const { roles } = req.user;

    if (!roles || !roles.includes('admin')) {
        return res.status(403).json({ message: 'Access denied. Administrator role required.' });
    }

    next();
}

module.exports = isAdmin;
