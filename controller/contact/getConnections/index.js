const Contact = require("../../../model/contact");
const AppError = require("../../../utils/appError");

const getConnections = async (req, res, next) => {
  console.log("getConnections function");

  const { userId } = req.params;

  const contact = await Contact.findOne({ userId }, { connectWith: 1, _id: 0 });

  if (!contact) {
    return res.status(200).json({
      status: "success",
      connectWith: [],
    });
  }

  return res.status(200).json({
    status: "success",
    connectWith: contact.connectWith,
  });
};

module.exports = getConnections;
