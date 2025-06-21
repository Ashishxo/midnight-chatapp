import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
    roomId: {
        type: String, 
        required: true,
        unique: true
    },
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Chat',
            required: true
        }
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
}, { timestamps: true })


export const roomModel = mongoose.model('Room', roomSchema)