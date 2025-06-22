import { getContacts } from "../controllers/chatController.js";
import { authenticateRequest } from "../middlewares/authenticateRequest.js";
import express from 'express'

const chatRouter = express.Router()

chatRouter.get('/contacts', authenticateRequest, getContacts)

export default chatRouter