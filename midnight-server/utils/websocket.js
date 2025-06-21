import { WebSocketServer } from 'ws';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });



  wss.on('connection', function connection(socket) {
    console.log(socket);

    socket.send("HAYYY");

    socket.on('message', function message(data) {
      console.log('📨 Received:', data.toString());
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });

  });
}
