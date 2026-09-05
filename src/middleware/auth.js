// Authentication & Authorization Middleware with Dual Session Cookie + Header Token Support

function getUserFromReq(req) {
    if (req.session && req.session.user) {
        return req.session.user;
    }
    const token = req.headers['x-auth-token'] || req.headers['authorization'];
    if (token) {
        try {
            const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            const decoded = JSON.parse(Buffer.from(rawToken, 'base64').toString('utf8'));
            return decoded;
        } catch (e) {
            return null;
        }
    }
    return null;
}

function requireAuth(req, res, next) {
    const user = getUserFromReq(req);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please log in first.'
        });
    }
    req.user = user;
    if (!req.session) req.session = {};
    req.session.user = user;
    next();
}

function requireRole(role) {
    return (req, res, next) => {
        const user = getUserFromReq(req);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. Please log in first.'
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Action requires ${role} privileges.`
            });
        }
        req.user = user;
        if (!req.session) req.session = {};
        req.session.user = user;
        next();
    };
}

module.exports = {
    requireAuth,
    requireRole
};
