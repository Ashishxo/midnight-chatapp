import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema({
    roomId: {
        type: String, 
        required: true,
        unique: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, { timestamps: true })


export const roomModel = mongoose.model('Room', roomSchema)