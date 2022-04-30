//const usersLogic = require('../middlewares/users.middleware');
import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import userModel from '../models/user';

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user create
router.post('/signup', jsonParser, (req: Request, res: Response) => {
    const {
        firstName, lastName, email, password
    } = req.body;

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
                        res.send(JSON.stringify({
                            userid: newUserId,
                            id: result[0]?._id
                        }))
                    }

                    res.status(500).send(); // TODO send descriptive error messages
                } catch {
                    res.status(500).send();
                }
            })
            .catch((err: Error) => console.error(err))
    });
})

// user login
router.post('/login', jsonParser, async (req, res) => {
    try {
        var result = await userModel.findOne({email: req.body.email});
        
        if (result && result._id)
            res.send(result);
        else
            res.send({userid: -1})
      } catch (err) {
        res.status(500).json({
            userid: -1
        });
      }
})

export default router;
