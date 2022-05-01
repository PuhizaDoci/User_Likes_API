import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import { authenticateToken } from "../middlewares/auth";
import CustomResponse from '../models/response';
import { getUserLikes, unlikeUser, addUserLike, checkUserLike } from '../services/userLikes.service';
import { getUser } from '../services/users.service';

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user and number of likes of a user
router.get("/:id", async (req: Request, res: Response) => {
    const userid = req.params.id;
    const user = await getUser(userid);
    const userLikes = await getUserLikes(userid);

    let likeNumbers = 0
    let customRes: CustomResponse = {
        success: false,
        error: ""
    };

    for await (const {} of userLikes) {
        likeNumbers += 1
      }
    
    if(user.length === 0){
        customRes.success = false
        customRes.error = "User not found";
        res.send(JSON.stringify(customRes))
    }

    try {
        res.send(JSON.stringify({user: user, likeNumber: likeNumbers}))
    } catch (err) {
        customRes.success = false
        const error = err as Error;
        customRes.error = error.message
        res.status(500).send(JSON.stringify(customRes));
    }
});

// add like
router.post('/:id/like', jsonParser, authenticateToken, async (req: Request, res:Response) => {
    const byuserid = req.user?.userid ?? 0,
        userid = req.params.id,
        {unlike, createdAt, lastModified} = req.body;

    let customRes: CustomResponse = {
        success: false,
        error: ""
    };

    const existingLike = await checkUserLike(userid, byuserid)

    if(!existingLike){
        const newLike = await addUserLike(userid, byuserid, unlike, createdAt, lastModified);
        
        if (newLike) {
            customRes.success = true
            customRes.data = newLike
            res.send(JSON.stringify({customRes}))
        } else {
            customRes.success = false;
            customRes.error = "Error occurred.";
            res.status(500).send(JSON.stringify(customRes))
        }
    }
    else{
        customRes.success = false;
        customRes.error = "Already liked this user!";
        res.status(400).send(JSON.stringify(customRes))
    }
})

// unlike
router.post('/:id/unlike', jsonParser, authenticateToken, async (req:Request, res:Response) => {
    const byuserid = req.user?.userid ?? 0,
        userid = req.params.id,
        filter = {byuserid: byuserid, userid: userid},
        unlike = true,
        lastModified = Date.now(),
        update = {unlike: unlike, lastModified: lastModified};

    let customRes: CustomResponse = {
            success: false,
            error: ""
        };

    const userUnlikeResponse = await unlikeUser(filter, update);
        
    if (userUnlikeResponse) {
        customRes.success = true
        customRes.data = userid
        res.send(JSON.stringify({customRes}))
    } else {
        customRes.success = false;
        customRes.error = "Error occurred.";
        res.status(500).send(JSON.stringify(customRes))
    }
})

export default router;