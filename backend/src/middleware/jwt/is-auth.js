import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = req.headers['x-auth-token'];
    if (!token) {
        req.user = {
            isAuth: false,
        }
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        req.user = {
            isAuth: false,
        }
        return next();
    }

    req.user = {
        isAuth: true,
        _id: decodedToken._id,
        name: decodedToken.username,
        role: decodedToken.role,
    }

    console.log(req)
    next();
}