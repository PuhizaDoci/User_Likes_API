import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  userid: {
    type: Number,
    required: true,
    unique: true 
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const userModel = model("User", UserSchema);
export default userModel;