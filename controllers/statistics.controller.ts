//const usersLogic = require('../middlewares/users.middleware');
import express, { Router, Request, Response } from "express";
import { authenticateToken } from "../middlewares/auth";
import { getAllUsers } from '../services/users.service';

const router: Router = express.Router();

// most liked
router.get("/most-liked", authenticateToken, async (req: Request, res: Response) => {
    const userLikes = await getAllUsers()
    
    // TODO "join" and sort

    try {
        res.send(userLikes);
    } catch (error) {
        res.status(500)
            .send(error);
    }
});

export default router;
