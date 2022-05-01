import express, { Router, Request, Response } from "express";
import { getAllUsers } from '../services/users.service';
import { getUserLikes } from '../services/userLikes.service';
import CustomResponse from '../models/response';

const router: Router = express.Router();

// most liked
router.get("/most-liked", async (_req: Request, res: Response) => {
    let customRes: CustomResponse = {
        success: false,
        error: ""
    };
    try {
        const users = await getAllUsers()
        let usersLikes = []

        // not my best work ever :/
        for await (const user of users) {
            const userLikes = await getUserLikes(user.userid)
            let likeNumbers = 0

            for await (const {} of userLikes) {
                likeNumbers += 1
            }
            usersLikes.push({user, likeNumbers})
        }

        usersLikes.sort((a,b) => b.likeNumbers - a.likeNumbers); 

        customRes.success = true
        customRes.data = usersLikes
        res.send(customRes);
    } catch (err) {
        customRes.success = false
        const error = err as Error;
        customRes.error = error.message
        res.status(500).send(JSON.stringify(customRes));
    }
});

export default router;
