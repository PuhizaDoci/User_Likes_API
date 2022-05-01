import userLikeModel from '../models/user-like'

export async function getUserLikes(userid: string) {
    try {
        return await userLikeModel.find({userid: userid, unlike: false});
    } catch {
        return null
    }
}

export async function checkUserLike(userid: string, byuserid: number) {
    try {
        return await userLikeModel.findOne({userid: userid, byuserid: byuserid, unlike: false});
    } catch {
        return null
    }
}

export async function unlikeUser(filter: {}, update: {}) {
    try {
        return await userLikeModel.updateOne(filter, update);
    } catch(err) {
        return null;
    }
}

export async function addUserLike(userid: string, byuserid: 
    number, unlike: boolean, createdAt: Date, lastModified: Date) {
    try {
        const newLike = new userLikeModel({
            userid, byuserid, unlike, createdAt, lastModified
        })
        return await newLike.save();
    } catch(err) {
        return null;
    }
}