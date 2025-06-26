import express from 'express'
import { login, register, logout, checkAuth } from '../controllers/authController.js';
import { authenticateRequest } from '../middlewares/authenticateRequest.js';

const authRouter = express.Router()

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout)
authRouter.get('/check-auth', authenticateRequest, checkAuth)


export default authRouter;