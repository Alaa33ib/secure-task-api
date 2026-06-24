import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Asigning secret 
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware that verifies tokens attached to the request's headder from the client
export const verifyToken = (req, res, next) => {

    //get the headder to check authorization
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        const error = new Error("Access denied, no security token provided.");
        error.statusCode = 401;
        return next(error);
    }

    //extract the token from the headder authorization string
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

// Middleware to check roles of users to approve their request or deny it, takes in a list of allowed roles.
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