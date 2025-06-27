
let socket;
let onMessageCallback = null;
let reconnectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 8;

function connectWebSocket(url) {
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    
    if (onMessageCallback) {
      onMessageCallback(event.data); 
    }
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = () => {
    console.log("🔌 WebSocket disconnected");
    attemptReconnect(url);
  };
}


function attemptReconnect(url) {
  if (reconnectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn("🛑 Max reconnection attempts reached");
    return;
  }

  reconnectionAttempts++;
  const retryDelay = Math.min(1000 * Math.pow(2, reconnectionAttempts), 8000); // exponential backoff max 10s

  console.log(`⏳ Attempting to reconnect in ${retryDelay / 1000}s...`);

  setTimeout(() => {
    console.log("🔁 Reconnecting...");
    connectWebSocket(url);
  }, retryDelay);
}

function closeWebSocket() {
  if (socket) {
    socket.onclose = null; // Prevent triggering reconnection
    socket.close();
    console.log("🛑 WebSocket manually closed");
    reconnectionAttempts = 0;
    socket = null;
  }
}


function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function subscribeToMessages(callback) {
  onMessageCallback = callback;
}

export default {
  connectWebSocket,
  sendMessage,
  subscribeToMessages,
  closeWebSocket
};
