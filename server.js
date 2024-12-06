const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Successfull DB Connection"))
  .catch((e) => console.log(e));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

server.listen(PORT, (e) => console.log(`Server running at port ${PORT}`));

global.onlineUsers = new Map();
global.offlineMessages = new Map(); // Store undelivered messages

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);

    // Check if the user has any undelivered messages
    const messages = global.offlineMessages.get(userId);
    if (messages && messages.length > 0) {
      // Deliver undelivered messages
      messages.forEach((message) => {
        socket.emit("get-message", message);
      });

      // Clear delivered messages
      global.offlineMessages.delete(userId);
    }
  });

  socket.on("send-message", (message) => {
    const reciverSocket = global.onlineUsers.get(message.reciverId);
    const senderSocket = global.onlineUsers.get(message.senderId);

    if (reciverSocket) {
      io.to(reciverSocket).emit("get-message", {
        ...message,
        status: "delivered",
      });
    } else {
      // Store message for offline recipient
      if (!global.offlineMessages.has(message.reciverId)) {
        global.offlineMessages.set(message.reciverId, []);
      }

      global.offlineMessages.get(message.reciverId).push({
        ...message,
        status: "pending",
      });
    }

    // Notify sender of delivery status
    if (senderSocket) {
      io.to(senderSocket).emit("get-message", {
        ...message,
        status: reciverSocket ? "delivered" : "sent",
      });
    }
  });

  socket.on("messages-seen", (data) => {
    const { userId, connectionId } = data;
    const reciverSocket = global.onlineUsers.get(connectionId);

    if (reciverSocket) {
      // Notify the recipient
      io.to(reciverSocket).emit("message-seen", userId);
    } else {
      console.log("Recipient is not online.");
    }
  });

  socket.on("disconnect", () => {
    global.onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
      }
    });
  });
});
