import { roomModel } from "../models/Room.js";
import { userModel } from "../models/User.js";


export const getContacts = async(req, res) => {
    const username = req.user;

    const user = await userModel.findOne({ username });
    if(!user) {
        res.status(400).json("User invalid.")
        return
    }

    const rooms = await roomModel.find({ _id: {$in: user.rooms}})
    const roomIds = rooms.map((room) => room.roomId)

    res.status(200).json(roomIds)
}