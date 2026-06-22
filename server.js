import express from "express";
import swaggerUI from "swagger-ui-express";
import yaml from "yamljs";
import taskRouterV1 from "./routes/v1/taskRoutes.js";
import authRouterV1 from "./routes/v1/authRoutes.js";

const app = express();
const PORT = 3000;

// Loading the swagger documentation and UI 
const swaggerDoc = yaml.load('./swagger.yaml');
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(express.json());

// Path to version #1 of the API. Task CRUD operations
app.use("/api/v1/tasks", taskRouterV1);

// Path to version #1 of the API. Register and login
app.use('/api/v1/auth', authRouterV1);

// Handling Errors
app.use((error, req, res, next)=>{
    console.error("System error, stack: ", error.stack);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal server error"
    });
});

// Starting the server and outputting the links
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    console.log(`Live interface documentation is live at http://localhost:${PORT}/api-docs`)
})