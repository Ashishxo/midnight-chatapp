let socket;
let onMessageCallback = null;

function connectWebSocket(url) {
  socket = new WebSocket(url);

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

function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
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
