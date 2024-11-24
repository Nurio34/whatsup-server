const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    connectWith: { type: [String], default: [] },
  },
  { timestamps: true, collection: "Contact" }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
