import express, {Express, Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import {generateJwtToken,authenticateToken} from './middlewares/auth';
import bodyParser from 'body-parser';
import userAuthController from './controllers/userAuth.controller';
import userProfileController from './controllers/users.controller';
import userLikeController from './controllers/userLikes.controller';
import statisticsController from './controllers/statistics.controller';

dotenv.config();
const jsonParser = bodyParser.json() 

const MongoStore = require('connect-mongo')(session)
const app: Express = express()
const port: Number = parseInt(process.env.PORT as string)

mongoose.connect(process.env.MONGODB as string, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    })
)
app.use('/api', userAuthController)
app.use('/api', statisticsController)
app.use('/api/me', userProfileController)
app.use('/api/user', userLikeController)


// TODO remove
//*
app.post('/api/test', jsonParser, (req: Request, res: Response) => {
    const token = generateJwtToken("0", req.body.email);
    res.json(token);
})

app.post('/api/secret', jsonParser, authenticateToken, (req: Request, res: Response) => {
   console.log('done request');
   res.send("You now have acess in what you asked for: " + req.user?.email)
})
//*

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})