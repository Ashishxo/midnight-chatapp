import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    message:{
        type: String,
        required: true,
        trim: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId:{
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
}, { timestamps: true })

chatSchema.index({ roomId: 1, createdAt: -1 });

export const chatModel = mongoose.model('Chat', chatSchema)