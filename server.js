import express from "express";
import swaggerUI from "swagger-ui-express";
import yaml from "yamljs";
import taskRouterV1 from "./routes/v1/taskRoutes.js";
import authRouterV1 from "./routes/v1/authRoutes.js";
import taskRouterV2 from "./routes/v2/taskRoutes.js";
import authRouterV2 from "./routes/v2/authRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Loading the swagger documentation and UI 
const swaggerDoc = yaml.load('./swagger.yaml');
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(express.json());

// Path to version #1 of the API. Task CRUD operations
app.use("/api/v1/tasks", taskRouterV1);
// Path to version #1 of the API. Register and login
app.use('/api/v1/auth', authRouterV1);

//Path to version #2 of the API. Task CRUD operations using MongoDB
app.use('/api/v2/tasks', taskRouterV2);
// Path to version #2 of the API. Register and login
app.use('/api/v2/auth', authRouterV2);

// Handling Errors
app.use((error, req, res, next)=>{
    console.error("System error, stack: ", error.stack);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal server error"
    });
});

// mongo db connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI).then(()=>{ console.log("Connected to MongoDB Cloud successfully.")
}).catch((error)=> console.log("Database connection error: ", error));

// Starting the server and outputting the links
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    console.log(`Live interface documentation is live at http://localhost:${PORT}/api-docs`)
})