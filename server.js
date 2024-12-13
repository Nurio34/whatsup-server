const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");
const Message = require("./model/chat");

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Successfull DB Connection"))
  .catch((e) => console.log(e));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

server.listen(PORT, () => console.log(`Server running at port ${PORT}`));

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(`${userId} is Online now..`);
    console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    global.onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        console.log(`${userId} is Offline now..`);
        console.log(onlineUsers);
      }
    });
  });
  socket.on("delete-message", (data) => {
    const { messageId, userId, connectionId } = data;
    const reciverSocket = global.onlineUsers.get(connectionId.toString());
    const senderSocket = global.onlineUsers.get(userId.toString());
    const sockets = [reciverSocket, senderSocket];
    console.log("Sockets:", sockets);

    if (reciverSocket && senderSocket) {
      sockets.forEach((socket) => {
        io.to(socket).emit("delete-message", {
          messageId,
          userId,
          connectionId,
        });
      });
    } else if (!reciverSocket && senderSocket) {
      io.to(senderSocket).emit("delete-message", {
        messageId,
        userId,
        connectionId,
      });
    }
  });
});

const changeStream = Message.watch([], { fullDocument: "updateLookup" });
console.log("changeStream:", changeStream);

changeStream.on("change", (change) => {
  const chanage_type = change.operationType;
  console.log("change_type", chanage_type);

  if (chanage_type === "insert") {
    const newMessage = change.fullDocument;
    console.log("New message detected !", newMessage);

    const { _id, senderId, type, message, status, createdAt, medias } =
      newMessage;
    const filteredNewMessage = {
      _id,
      senderId,
      type,
      message,
      status,
      createdAt,
      medias,
    };

    const reciverSocket = global.onlineUsers.get(
      newMessage.reciverId.toString()
    );
    const senderSocket = global.onlineUsers.get(newMessage.senderId.toString());
    const sockets = [reciverSocket, senderSocket];
    console.log("Sockets:", sockets);

    if (reciverSocket && senderSocket) {
      sockets.forEach((socket) => {
        io.to(socket).emit("new-message", filteredNewMessage);
      });
    } else if (!reciverSocket && senderSocket) {
      io.to(senderSocket).emit("new-message", filteredNewMessage);
    }
  } else if (chanage_type === "update") {
    const updatedMessage = change.fullDocument;
    const { _id, senderId, type, message, status, createdAt } = updatedMessage;
    const filteredUpdatedMessage = {
      _id,
      senderId,
      type,
      message,
      status,
      createdAt,
    };

    const reciverSocket = global.onlineUsers.get(
      updatedMessage.reciverId.toString()
    );
    const senderSocket = global.onlineUsers.get(
      updatedMessage.senderId.toString()
    );
    const sockets = [reciverSocket, senderSocket];
    sockets.forEach((socket) => {
      io.to(socket).emit("message-seen", filteredUpdatedMessage);
    });
  }
});
