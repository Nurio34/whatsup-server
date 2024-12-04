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

io.on("connection", (socket) => {
  // console.log("User connected: ", socket.id);

  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ID: ${socket.id}`);
    console.log(onlineUsers);
  });

  socket.on("send-message", (message) => {
    const reciverSocket = global.onlineUsers.get(message.reciverId);
    const senderSocket = global.onlineUsers.get(message.senderId);

    console.log({ reciverSocket, senderSocket });

    if (reciverSocket) {
      io.to(reciverSocket).emit("get-message", {
        ...message,
        status: "delivered",
      });
    }

    if (reciverSocket && senderSocket) {
      io.to(senderSocket).emit("get-message", {
        ...message,
        status: "delivered",
      });
    }

    if (!reciverSocket && senderSocket) {
      io.to(senderSocket).emit("get-message", {
        ...message,
        status: "sent",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    global.onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        console.log(
          `User ${userId} disconnected and removed from onlineUsers.`
        );
      }
    });
    console.log(onlineUsers);
  });
});
