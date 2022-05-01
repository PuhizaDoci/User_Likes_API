import userModel from '../models/user';

export async function getUser(userid: string | number) {
	try {
		return await userModel.find({
			userid: userid
		});
	} catch {
		return null
	}
}

export async function getAllUsers() {
	try {
		return await userModel.find({});
	} catch {
		return null
	}
}

export async function getUserForLogin(email: string, password: string) {
	try {
		return await userModel.findOne({
			email: email,
			password: password
		});
	} catch {
		return null
	}
}

export async function updateUserPassword(filter: {}, update: {}) {
	try {
		return await userModel.updateOne(filter, update);
	} catch (err) {
		return null
	}
}

export async function addUser(userid: string, firstName: string, lastName: string,
	email: string, password: string, createdAt: number) {
	try {
		const newUser = new userModel({
			userid,
			firstName,
			lastName,
			email,
			password,
			createdAt
		})
		return await newUser.save();
	} catch (err) {
		return null;
	}
}