import express from "express";
import {verifyToken, authorizeRoles} from "../../middleware/auth.js";
import { validateTask, validateUpdateTask } from "../../middleware/validateV2.js";
import Task from "../../models/Task.js";

const router = express.Router();

// Path to get all tasks, checks if the user is authorized with the token. Accessable for all users
router.get('/', verifyToken, async (req, res, next)=> {
    try {
        const tasks = await Task.find();

        res.status(200).json({
        success: true,
        message: "you can see the tasks, youre authenticated",
        count: tasks.length,
        data: tasks
        });
    } catch(error){
        next(error);
    }

});

// Path to create a new task, validates the user input and their token. Accessable to all users
router.post('/', verifyToken, validateTask, async (req, res, next)=>{
    try{
        const newTask = await Task.create(req.body);
        res.status(201).json({ success: true, data: newTask});
    } catch(error){
        next(error);
    }
});

// Path to update an existing task, verifies tokena dn validates input. Accessable to all users
router.put('/:id', verifyToken, validateUpdateTask, async (req, res, next)=>{
    try{
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true}
        );
    
        if(!updatedTask){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        res.status(200).json({ success: true, data: updatedTask});

    } catch(error){
        next(error);
    }
});

// Path to delete an existing task, validates token and checks for authorization. Accessable to admins only
router.delete('/:id', verifyToken, authorizeRoles(['admin']), async (req, res, next)=>{
    try{
       const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
        if(!deletedTask){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        res.status(200).json({ 
            success: true, 
            message: "Task successfully deleted from database.", 
            data: deletedTask
        });

    } catch(error){
        next(error);
    }
});

export default router;