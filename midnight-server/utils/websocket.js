import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken'
import createStore from './store.js';

function onSocketError(err){
  console.log(err)
}

export function setupWebSocket(server) {
  const store = createStore();
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    socket.on('error', onSocketError)

    const protocols = request.headers['sec-websocket-protocol']
    if(!protocols){
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      console.log('err 1')
      return;
    }

    const [protocolName, token] = protocols.split(',').map(p => p.trim())

    if(protocolName !== 'jwt' || !token){
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      console.log('err 2')
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      request.user = decoded;
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

    store.createUser(socket.username, socket)
    console.log(store.getUser(socket.username).username)
    socket.send("Heyy");

    socket.on('message', function message(data) {
      console.log('📨 Received:', data.toString());
    });

    socket.on('close', () => {
      store.deleteUser(socket.username)
      console.log('Client disconnected');
    });

  });

}
