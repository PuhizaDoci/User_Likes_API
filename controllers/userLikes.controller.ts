//const userLikesLogic = require('../middlewares/userLikes.middleware');
import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import { authenticateToken } from "../middlewares/auth";
import userModel from "../models/user";
import userLikeModel from "../models/user-like";

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user and number of likes of a user
router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
    const {userid} = req.params;
    const user = await userModel.find({userid: userid});
    const userLikes = await userLikeModel.find({userid: userid});
    const likeNumbers = 2; // TODO count userLikes

    try {
        res.send(userLikes); // TODO send both user and userLikes
    } catch (error) {
        res.status(500)
            .send(error);
    }
});

// add like
router.post('/:id/like', jsonParser, authenticateToken, async (req: Request, res:Response) => {
    const {byuserid} = req.params, // TODO auth
        {userid} = req.params,
        {
            unlike, createdAt, lastModified
        } = req.body;

    const newLike = new userLikeModel({
        userid, byuserid, unlike, createdAt, lastModified
    })

    newLike.save()
        .then(() => {
            res.send(JSON.stringify(userid)) // TODO send message?
        })
        .catch(err => console.error(err))
})

// unlike
router.post('/:id/unlike', jsonParser, authenticateToken, async (req:Request, res:Response) => {
    const byuserid = req.user?.userid ?? 0,
        {userid} = req.body,
        filter = {byuserid: byuserid, userid: userid},
        unlike = true,
        update = {unlike: unlike};

    await userLikeModel.updateOne(filter, update)
        .then(() => {
            res.send("success")
        })
        .catch((err:Error) => console.error(err))
})

export default router;