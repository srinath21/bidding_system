const jwt = require('jsonwebtoken');

const getTokenFromHeaders = (req) => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

module.exports = {
    auth: (req, res, next) => {
        const token = getTokenFromHeaders(req);
        if (!token) {
            console.log("Error: Unauthorized")
            res.status(401);
            res.end();
            return;
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'superSecret');
            req.token_details = decodedToken;
            next();
        }
        catch (error) {
            console.log("Error: ", error)
            res
                .status(401)
                .json({
                    error: error,
                    success: false
                })
            res.end();
            return;
        }
    }
}