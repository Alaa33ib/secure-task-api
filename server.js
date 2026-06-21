import express from "express";
import taskRouterV1 from "./routes/v1/taskRoutes.js"

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/v1/tasks", taskRouterV1);

app.use((error, req, res, next)=>{
    console.error("System error, stack: ", error.stack);
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal server error"
    });
});

app.listen(PORT, ()=>console.log(`server is running on http://localhost:${PORT}`))