//const usersLogic = require('../middlewares/users.middleware');
import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import userModel from '../models/user';
import {generateJwtToken} from '../middlewares/auth';
import CustomResponse from '../models/response';

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user create
router.post('/signup', jsonParser, (req: Request, res: Response) => {
    const {
        firstName, lastName, email, password
    } = req.body;
    
    let customRes: CustomResponse = {
        success: false,
        error: ""
    };

    userModel.find({}).then((result: any) => { // TODO remove anys
        let newUserId = result.length + 1;
        const createdAt = Date.now();
        const newUser = new userModel({
            userid: newUserId, firstName, lastName,
            email, password, createdAt
        })

        newUser.save()
            .then(async () => {
                try {
                    var result = await userModel.find({userid: newUserId});

                    if (result[0]?._id?.toString().length >= 1) {
                        const token = generateJwtToken(result[0]?.newUserId, req.body.email);
                        res.send(JSON.stringify({
                            userid: newUserId,
                            id: result[0]?._id,
                            token: token
                        }))
                    }
                    
                    customRes.success = false
                    customRes.error = "Could not find recently saved user id"

                    res.status(500).send(customRes);
                } catch(err) {
                    customRes.success = false
                    customRes.error = err as string

                    res.status(500).send(JSON.stringify(customRes));
                }
            })        
            .catch((err: Error) => {
                customRes.success = false
                customRes.error = err.message
                
                res.send(JSON.stringify(customRes))
            })
    });
})

// user login
router.post('/login', jsonParser, async (req: Request, res: Response) => {
    try {
        var result = await userModel.findOne({email: req.body.email, password: req.body.password});
        
        if (result && result._id){
            const token = generateJwtToken(result.userid, req.body.email);
            res.send(JSON.stringify({
                user: result,
                id: result._id,
                token: token
            }))
        }
        else
            res.send({userid: -1})
      } catch (err) {
        res.status(500).json({
            userid: -1
        });
      }
})

export default router;
