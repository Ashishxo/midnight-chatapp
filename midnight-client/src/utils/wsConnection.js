let socket;
let onMessageCallback = null;

function connectWebSocket(url) {
  socket = new WebSocket(url, ["jwt", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF4aGlzaCIsImlhdCI6MTc1MDU3NDE5MX0.uRwjecfW9g698md83jj8JVL0D3wkU1WWO-KqrmVLoI8']);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("📨 Received from server:", event.data);
    if (onMessageCallback) {
      onMessageCallback(event.data); // Notify whoever subscribed
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
  };
}

function sendMessage() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({message: "ashish"}));
  }
}

function subscribeToMessages(callback) {
  onMessageCallback = callback;
}

export default {
  connectWebSocket,
  sendMessage,
  subscribeToMessages
};
