import { Schema, model, Document } from 'mongoose';

const UserLikeSchema= new Schema({
    userid:{
        type:Number,
        required:true
    },
    byuserid:{
        type:Number,
        required:true
    },
    unlike:{
        type:Boolean,
        default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastModified: {
        type: Date
    }
});

const userLike = model('UserLike', UserLikeSchema);
export default userLike;