import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const router = express.Router();

const JWT_SECRET = "secret_key_aaa111";

// User registeration path (creates a new account)
router.post('/register', async (req, res, next)=>{
    try{
        const {username, password, role} = req.body;

        // Check for credentials
        if (!username || ! password){
            const error = new Error("Username and password are required");
            error.statusCode = 400;
            return next(error);
        }
        
        // Check if the username exists
        if ( await User.findOne({username})){
            const error  = new Error("Username already exists, enter a new user or login");
            error.statusCode = 400;
            return next(error);
        }
        
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user to the users.json file
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role: role || "user"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error){
        next(error);
    }
})

// Path for logging in into an existing account, returns the authorization token.
router.post('/login', async (req, res, next)=>{
    try{
        const { username, password} = req.body;


        // Matches the user with their record in the json file
        const user = await User.findOne({username}).select("+password");

        if (!user){
            const error = new Error("Invalid username");
            error.statusCode = 401;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            const error = new Error("Invalid password");
            error.statusCode = 401;
            return next(error);
        }

        // Creates a session token that expires in an hour
        const token  = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            success: true,
            token: token
        })

    } catch(error){
        next(error);
    }
});

export default router;
