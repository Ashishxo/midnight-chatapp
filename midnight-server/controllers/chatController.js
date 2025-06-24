import { roomModel } from "../models/Room.js";
import { userModel } from "../models/User.js";
import { chatModel } from "../models/Chat.js";


export const getChatList = async(req, res) => {

  try {
    const username = req.user;

    const user = await userModel.findOne({ username });
    if(!user) {
        res.status(400).json("User invalid.")
        return
    }

    const rooms = await roomModel.find({ _id: { $in: user.rooms } }).populate('users', 'username');

    const chatList = []

    for(const room of rooms){
      const otherUser = room.users.find(u => u.username !== user.username);

      const lastMessage = await chatModel.findOne({ roomId: room._id}).sort({ createdAt: -1 }).select("message createdAt userId").populate("userId", "username");

      chatList.push({
        roomId: room.roomId,
        contactName: otherUser?.username || "Unknown",
        lastMessage: lastMessage?.message || "",
        lastMessageAt: lastMessage?.createdAt || null,
        sender: lastMessage?.userId?.username || null
      })
    }

    chatList.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    res.status(200).json(chatList)

  } catch (error) {
    console.error("❌ Error in getChatList:", error.message)
    res.status(500).json("Internal Server Error");
  }
    
}