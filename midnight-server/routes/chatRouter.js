import { getChatList } from "../controllers/chatController.js";
import { authenticateRequest } from "../middlewares/authenticateRequest.js";
import express from 'express'

const chatRouter = express.Router()

chatRouter.get('/chatlist', authenticateRequest, getChatList)

export default chatRouter