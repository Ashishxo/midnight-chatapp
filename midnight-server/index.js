import express from 'express';
import http from 'http';
import { setupWebSocket } from './utils/websocket.js';
import dotenv from 'dotenv';
import connectDB from './utils/dbConnection.js';
import authRouter from './routes/authRouter.js';
import chatRouter from './routes/chatRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser())

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
