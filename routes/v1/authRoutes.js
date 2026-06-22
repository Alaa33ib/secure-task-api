import express from "express";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

const users_file = './data/users.json';
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

        const data = await fs.readFile(users_file, 'utf-8');
        const users = JSON.parse(data);
        
        // Check if the username exists
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())){
            const error  = new Error("Username already exists, enter a new user or login");
            error.statusCode = 400;
            return next(error);
        }
        
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user to the users.json file
        const newUser = {
            id: users.length > 0 ? users[users.length - 1 ].id + 1 : 1,
            username,
            password: hashedPassword,
            role: role || "user"
        };

        users.push(newUser);

        await fs.writeFile(users_file, JSON.stringify(users, null, 2));

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    } catch (error){
        next(error);
    }
})

// Path for loging in into an existing account, returns the authorization token.
router.post('/login', async (req, res, next)=>{
    try{
        const { username, password} = req.body;

        const data = await fs.readFile(users_file, 'utf-8');
        const users = JSON.parse(data);

        // Matches the user with their record in the json file
        const user = users.find( u => u.username.toLowerCase()=== username.toLowerCase());

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
                id: user.id,
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
