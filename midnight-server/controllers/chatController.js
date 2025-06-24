import { roomModel } from "../models/Room.js";
import { userModel } from "../models/User.js";


export const getContacts = async(req, res) => {
    const username = req.user;

    const user = await userModel.findOne({ username });
    if(!user) {
        res.status(400).json("User invalid.")
        return
    }

    const rooms = await roomModel.find({ _id: { $in: user.rooms } }).populate('users', 'username');


    const contacts = rooms.map((room) => {
        const otherUser = room.users.find(u => u.username !== username);
      return {
        roomId: room.roomId,
        contactName: otherUser?.username || "Unknown"
      };
    });

    res.status(200).json(contacts)
}