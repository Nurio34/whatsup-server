const sendMessage = async (req, res, next) => {
  console.log("sendMessage function");

  const { senderId, reciverId, message, type } = req.body;
  console.log({ senderId, reciverId, message, type });
};

module.exports = sendMessage;
