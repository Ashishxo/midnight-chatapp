import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    fname:{
        type: String, 
        required: true,
        trim: true
    },
    lname: {
        type: String,
        trim: true
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
}, { timestamps: true })

export const userModel = mongoose.model('User', userSchema)