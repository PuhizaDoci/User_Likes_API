import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser';
import { authenticateToken } from "../middlewares/auth";
import userModel from '../models/user';
import CustomResponse from '../models/response';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

// me
router.get("/", authenticateToken, async (req: Request, res: Response) => {
    const userid = req.user?.userid ?? 0;
    const user = await userModel.find({userid: userid});

    let customRes: CustomResponse = {
        success: false,
        error: ""
    };

    try {
        customRes.success = true

        res.send(JSON.stringify({response: customRes, user: user}))
    } catch (error) {
        customRes.success = false
        customRes.error = error as string

        res.status(500).send(JSON.stringify(customRes))
    }
});

// user password update 
router.post('/update-password', jsonParser, authenticateToken, async (req:Request, res:Response) => {
    const userid = req.user?.userid ?? 0,
        {email, password} = req.body,
        filter = {userid: userid, email: email},
        update = {password: password};
    
    let customRes: CustomResponse = {
            success: false,
            error: ""
        };

    userModel.updateOne(filter, update)
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
