import jwt from "jsonwebtoken";

const JWT_SECRET = "secret_key_aaa111";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        const error = new Error("Access denied, no security token provided.");
        error.statusCode = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify( token, JWT_SECRET);
        req.user = decoded;

        next();
    }  catch(err){
        const error = new Error("Invalid or expired token.");
        error.statusCode = 403;
        return next(error);
    }
};

export const authorizeRoles = (allowedRoles) => {
    return (req, res, next) =>{
        if(!allowedRoles.includes(req.user.role)){
            const error = new Error("youre not authorized to perform this action");
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};