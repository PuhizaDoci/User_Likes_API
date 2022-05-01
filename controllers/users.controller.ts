import express, { Router, Request, Response } from "express";
import bodyParser from 'body-parser';
import { authenticateToken } from "../middlewares/auth";
import { getUser, updateUserPassword, getUserForLogin } from '../services/users.service';
import CustomResponse from '../models/response';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

// me
router.get("/", authenticateToken, async (req: Request, res: Response) => {
	const userid = req.user?.userid ?? 0;
	const user = await getUser(userid);

	let customRes: CustomResponse = {
		success: false,
		error: ""
	};

	if (user) {
		customRes.success = true
		customRes.data = user
		res.send(JSON.stringify({
			customRes
		}))
	} else {
		customRes.success = false;
		customRes.error = "User not found";
		res.status(500).send(JSON.stringify(customRes))
	}
});

// user password update 
router.post('/update-password', jsonParser, authenticateToken, async (req: Request, res: Response) => {
	const userid = req.user?.userid ?? 0,
		{
			email,
			oldPassword,
			newPassword
		} = req.body,
		filter = {
			userid: userid,
			email: email,
			password: oldPassword
		},
		update = {
			password: newPassword
		};

	let customRes: CustomResponse = {
		success: false,
		error: ""
	};

	var result = await getUserForLogin(req.body.email, req.body.oldPassword);

	if (!result) {
		customRes.success = false;
		customRes.error = "Error occurred";
		res.status(500).send(JSON.stringify(customRes))
	}

	const userUpdateResponse = await updateUserPassword(filter, update);

	if (userUpdateResponse) {
		customRes.success = true
		customRes.data = userid
		res.send(JSON.stringify({
			customRes
		}))
	} else {
		customRes.success = false;
		customRes.error = "Error occurred";
		res.status(500).send(JSON.stringify(customRes))
	}
})

export default router;