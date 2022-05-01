//const usersLogic = require('../middlewares/users.middleware');
import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser'
import { generateJwtToken } from '../middlewares/auth';
import CustomResponse from '../models/response';
import { getUserForLogin, getAllUsers, getUser, addUser } from '../services/users.service';

const router: Router = express.Router();
const jsonParser = bodyParser.json() 

// user create
router.post('/signup', jsonParser, async (req: Request, res: Response) => {
	const {
		firstName,
		lastName,
		email,
		password
	} = req.body;

	let customRes: CustomResponse = {
		success: false,
		error: ""
	};

	try {
		const allUsers = await getAllUsers();

		let newUserId = allUsers.length + 1;
		const createdAt = Date.now();

		await addUser(newUserId, firstName, lastName, email, password, createdAt)
		var result = await getUser(newUserId);

		if (result[0]?._id?.toString().length >= 1) {
			const token = generateJwtToken(result[0]?.newUserId, req.body.email);
			res.send(JSON.stringify({
				userid: newUserId,
				id: result[0]?._id,
				token: token
			}))
		} else {
			customRes.success = false
			customRes.error = "Could not find recently saved user id"

			res.status(500).send(customRes);
		}
	} catch (err) {
		customRes.success = false
		const error = err as Error;
		customRes.error = error.message

		res.send(JSON.stringify(customRes))
	}
})

// user login
router.post('/login', jsonParser, async (req: Request, res: Response) => {
	let customRes: CustomResponse = {
		success: false,
		error: "",
	};

	try {
		var result = await getUserForLogin(req.body.email, req.body.password);

		if (result && result._id) {
			const token = generateJwtToken(result.userid, req.body.email);
			res.send(JSON.stringify({
				user: result,
				id: result._id,
				token: token
			}))
		} else {
			customRes.success = false
			customRes.error = "User not found"
			res.send(JSON.stringify(customRes))
		}
	} catch (err) {
		customRes.success = false
		const error = err as Error;
		customRes.error = error.message

		res.status(500).send(JSON.stringify(customRes))
	}
})

export default router;