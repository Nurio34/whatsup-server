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
    origin: "http://localhost:3000",
  },
});

server.listen(PORT, (e) => console.log(`Server running at port ${PORT}`));

// io.on("connection", (socket) => {
//   //! *** WHEN CLIENT HAS SOCKET CONNECTION, ADD IT TO ONLINEUSERS ***
//   socket.on("add-user", (userId) => {
//     global.onlineUsers.set(userId, socket.id);
//     //! **************************************************************

//     //! CHECK IF CLIENT HAS ANY UNDELIVERED MESSAGES ***
//     const messages = global.offlineMessages.get(userId);
//     if (messages && messages.length > 0) {
//       // Deliver undelivered messages
//       messages.forEach((message) => {
//         socket.emit("get-message", message);
//       });

//       // Clear delivered messages
//       global.offlineMessages.delete(userId);
//     }
//     //! ************************************************
//   });

//   socket.on("disconnect", () => {
//     global.onlineUsers.forEach((socketId, userId) => {
//       if (socketId === socket.id) {
//         global.onlineUsers.delete(userId);
//       }
//     });
//   });

//   socket.on("send-message", (message) => {
//     const reciverSocket = global.onlineUsers.get(message.reciverId);
//     const senderSocket = global.onlineUsers.get(message.senderId);

//     if (reciverSocket) {
//       io.to(reciverSocket).emit("get-message", {
//         ...message,
//         status: "delivered",
//       });
//     } else {
//       // Store message for offline recipient
//       if (!global.offlineMessages.has(message.reciverId)) {
//         global.offlineMessages.set(message.reciverId, []);
//       }

//       global.offlineMessages.get(message.reciverId).push({
//         ...message,
//         status: "pending",
//       });
//     }

//     // Notify sender of delivery status
//     if (senderSocket) {
//       io.to(senderSocket).emit("get-message", {
//         ...message,
//         status: reciverSocket ? "delivered" : "sent",
//       });
//     }
//   });

//   socket.on("messages-seen", (data) => {
//     const { userId, connectionId } = data;
//     const reciverSocket = global.onlineUsers.get(connectionId);

//     if (reciverSocket) {
//       // Notify the recipient
//       io.to(reciverSocket).emit("message-seen", userId);
//     } else {
//       console.log("Recipient is not online.");
//     }
//   });
// });

global.onlineUsers = new Map();
global.offlineMessages = new Map(); // Store undelivered messages

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    // console.log(`${userId} is Online now..`);
    // console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    global.onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        // console.log(`${userId} is Offline now..`);
        // console.log(onlineUsers);
      }
    });
  });
});

const changeStream = Message.watch([], { fullDocument: "updateLookup" });

changeStream.on("change", (change) => {
  const chanage_type = change.operationType;

  if (chanage_type === "insert") {
    const newMessage = change.fullDocument;
    const { _id, senderId, type, message, status, createdAt } = newMessage;
    const filteredNewMessage = {
      _id,
      senderId,
      type,
      message,
      status,
      createdAt,
    };

    const reciverSocket = global.onlineUsers.get(
      newMessage.reciverId.toString()
    );
    const senderSocket = global.onlineUsers.get(newMessage.senderId.toString());
    const sockets = [reciverSocket, senderSocket];

    // Emit the message to both the sender and receiver if they are online

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
