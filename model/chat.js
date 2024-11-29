const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: String,
    message: String,
    status: String,
  },
  { timestamps: true, collection: "Message" }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
