const { verify } = require("jsonwebtoken");

function validateToken(req, res, next) {
    const accessToken = req.header("accessToken");

    if (!accessToken) return res.json({ error: "log in first!" })
    
    try {
        const validToken = verify(accessToken, "5687ft8436t8bf743f8");
        req.user = validToken;

        if (validToken) {
            return next();
        }
    }
    catch (error) {
        return res.json({ error: error })
    }
}

module.exports = { validateToken }