import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import userAuthController from './controllers/userAuth.controller';
import userProfileController from './controllers/users.controller';
import userLikeController from './controllers/userLikes.controller';
import statisticsController from './controllers/statistics.controller';

dotenv.config();

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

app.listen(process.env.NODE_ENV !== 'test' ? port : 0, () => {
    console.log(`Listening at http://localhost:${port}`)
})

export default app;
