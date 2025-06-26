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


export const getChats = async (req, res) => {

  const { roomId } = req.params;
  console.log(req.user)
  const users = roomId.split('_')
  if (!users.includes(req.user)) {
    return res.status(401).json("Unauthorized user.");
  }

  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;


  try {
    const room = await roomModel.findOne({ roomId })
    
    if(!room) return res.status(404).json("Room not found");
    
    const chats = await chatModel.find({ roomId: room._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "username")
    const messages = chats.reverse()
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json("Server error");
  }
  
}