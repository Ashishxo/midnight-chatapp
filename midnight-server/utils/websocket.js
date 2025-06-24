import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import createStore from './store.js';
import { roomModel } from '../models/Room.js';
import { userModel } from '../models/User.js';
import { chatModel } from '../models/Chat.js';

function onSocketError(err){
  console.log(err)
}

export function setupWebSocket(server) {
  const store = createStore();
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    socket.on('error', onSocketError)

    const cookies = cookie.parse(request.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      console.log('err: no token cookie');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      request.user = decoded.username;
      socket.removeListener('error', onSocketError);

      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.username = decoded.username;
        wss.emit('connection', ws, request);
      })
    } 
    catch (error) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      console.log('err 3')
      socket.destroy();
    }

  })

  wss.on('connection', function connection(socket) {
    if (!socket.username) {
      console.warn("Socket has no username attached");
      return;
    }

    if (store.getUser(socket.username)) {
      console.warn("Duplicate socket connection for", socket.username);
      socket.close();
      return;
    }
    store.createUser(socket.username, socket);

    socket.send("Heyy");

    socket.on('message', async function message(data) {
      const message = JSON.parse(data.toString())
      if (!socket.username) {
        console.warn("Socket has no username attached");
        return;
      }      
      
      if(message.type === "room-init"){
        const { body, id } = message;

        const currentUser = await userModel.findOne({ username: socket.username})
        const otherUser = await userModel.findOne({ username: id});

        if(!otherUser) {
          socket.send("Room Creation Failed: Username Invalid");
          return;
        }
        if(!currentUser) {
          socket.send("Room Creation Failed: Current User Invalid");
          return;
        }

        const sortedUsernames = [currentUser.username, otherUser.username].sort();
        const roomId = sortedUsernames.join('_')

        const existingRoom = await roomModel.findOne({ roomId });
        if(existingRoom){
          socket.send("Room Already Exists");
          return;
        }

        const newRoom = await roomModel.create({
          roomId,
          users: [currentUser._id, otherUser._id]
        });

        await userModel.updateOne({ _id: currentUser._id }, { $addToSet: { rooms: newRoom._id } });
        await userModel.updateOne({ _id: otherUser._id }, { $addToSet: { rooms: newRoom._id } });
        socket.send("New Room Created!")
      }

      else if(message.type === "message"){
        const { body, id } = message;

        const currentUser = await userModel.findOne({ username: socket.username})
        if(!currentUser){
          socket.send("Error sending message: Current User Invalid");
          return;
        }

        const room = await roomModel.findOne({ roomId: id })
        if(!room){
          socket.send("Error sending message: Room Doesn't Exist")
          return;
        }
        const members = await userModel.find({ _id: { $in: room.users } });

        for(const member of members){
          const userSocket = store.getUser(member.username);
          if(userSocket && userSocket !== socket){
            userSocket.send(JSON.stringify({
              type: 'message',
              body,
              from: socket.username,
              roomId: id
            }));
          }
        }

        await chatModel.create({
          message: body,
          userId:  currentUser._id,
          roomId: room._id
        })

      }

    });

    socket.on('close', () => {
      store.deleteUser(socket.username)
      console.log('Client disconnected');
    });

  });

}
