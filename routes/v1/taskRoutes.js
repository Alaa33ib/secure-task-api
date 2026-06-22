import express from "express";
import {verifyToken, authorizeRoles} from "../../middleware/auth.js";
import { validateTask, validateUpdateTask } from "../../middleware/validate.js";
import fs from "fs/promises";

const router = express.Router();
const TASKS_FILE = './data/tasks.json';

// Path to get all tasks, checks if the user is authorized with the token. Accessable for all users
router.get('/', verifyToken, async (req, res, next)=> {
    try {
        const data = await fs.readFile(TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);
        res.status(200).json({
        success: true,
        message: "you can se the tasks, youre authenticated",
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
        const data = await fs.readFile(TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);
        let newTask = {
            id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
            ...req.body
        };
        tasks.push(newTask);
        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        res.status(201).json({ success: true, data: newTask});
    } catch(error){
        next(error);
    }
});

// Path to update an existing task, verifies tokena dn validates input. Accessable to all users
router.put('/:id', verifyToken, validateUpdateTask, async (req, res, next)=>{
    try{
        const data = await fs.readFile(TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);

        const taskID = Number(req.params.id);
        const taskIndx = tasks.findIndex(task=>task.id === taskID);
    
        if(taskIndx===-1){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        tasks[taskIndx] = {
            ...tasks[taskIndx],
            ...req.body
        };

        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        res.status(200).json({ success: true, data: tasks[taskIndx]});

    } catch(error){
        next(error);
    }
});

// Path to delete an existing task, validates token and checks for authorization. Accessable to admins only
router.delete('/:id', verifyToken, authorizeRoles(['admin']), async (req, res, next)=>{
    try{
        const data = await fs.readFile(TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);

        const taskID = Number(req.params.id);
        const taskIndx = tasks.findIndex(task=>task.id === taskID);
    
        if(taskIndx===-1){
            const error = new Error('Task not found');
            error.statusCode= 404;
            return next(error);
        }

        const deletedTask = tasks[taskIndx];
        tasks.splice(taskIndx, 1);

        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
        res.status(200).json({ success: true, data: deletedTask});
    } catch(error){
        next(error);
    }
});

export default router;