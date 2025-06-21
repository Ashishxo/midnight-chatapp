import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    message:{
        type: String,
        required: true,
        trim: true
    },
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })


export const chatModel = mongoose.model('Chat', chatSchema)