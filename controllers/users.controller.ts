import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser';
import { authenticateToken } from "../middlewares/auth";
import userModel from '../models/user';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

// me
router.get("/", authenticateToken, async (req: Request, res: Response) => {
    const userid = req.user?.userid ?? 0;
    const user = await userModel.find({userid: userid});

    try {
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
});

// user password update 
router.post('/update-password', jsonParser, authenticateToken, async (req:Request, res:Response) => {
    const userid = req.user?.userid ?? 0,
        {email, password} = req.body,
        filter = {userid: userid, email: email},
        update = {password: password};

    userModel.updateOne(filter, update)
        .then(() => {
            res.send("success")
        })
        .catch((err: Error) => console.error(err))
})

export default router;
