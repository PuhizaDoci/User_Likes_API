//const userLikesLogic = require('../middlewares/userLikes.middleware');
import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import { authenticateToken } from "../middlewares/auth";
import userModel from "../models/user";
import userLikeModel from "../models/user-like";
import CustomResponse from '../models/response';

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user and number of likes of a user
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
    const {userid} = req.params;
    const user = await userModel.find({userid: userid});
    const userLikes = await userLikeModel.find({userid: userid});
    const likeNumbers = 2 // TODO count userLikes

    try {
        res.send(JSON.stringify({user: user, likeNumber: likeNumbers}))
    } catch (error) {
        res.status(500).send(error);
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

    const newLike = new userLikeModel({
        userid, byuserid, unlike, createdAt, lastModified
    })

    newLike.save()
        .then(() => {
            customRes.success = true

            res.send(JSON.stringify({response: customRes, likeAdded: newLike}))
        })        
        .catch((err: Error) => {
            customRes.success = false
            customRes.error = err.message

            res.send(JSON.stringify(customRes))
        })
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

    userLikeModel.updateOne(filter, update)
        .then(() => {
            customRes.success = true

            res.send(JSON.stringify(customRes))
        })
        .catch((err: Error) => {
            customRes.success = false
            customRes.error = err.message
            
            res.send(JSON.stringify(customRes))
        })
})

export default router;