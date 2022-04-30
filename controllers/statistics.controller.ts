//const usersLogic = require('../middlewares/users.middleware');
import express, { Router, Request, Response } from "express";
import { authenticateToken } from "../middlewares/auth";

const router: Router = express.Router();
import userLikeModel from "../models/user-like";

// most liked
router.get("/most-liked", authenticateToken, async (req: Request, res: Response) => {
    const userLikes = await userLikeModel.find({});
    // TODO "join" and sort

    try {
        res.send(userLikes);
    } catch (error) {
        res.status(500)
            .send(error);
    }
});

export default router;
