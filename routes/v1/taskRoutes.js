import express from "express";
import {verifyToken, authorizeRoles} from "../../middleware/auth.js"

const router = express.Router();


router.get('/', verifyToken, (req, res)=> {
    res.status(200).json({
        success: true,
        message: "you can se the tasks, youre authenticated"
    });
});

router.delete('/:id', verifyToken, authorizeRoles(['admin']), (req, res)=>{
    res.status(200).json({
        success: true,
        message: `task ${req.params.id} was deleted successfully`
    });
});

export default router;