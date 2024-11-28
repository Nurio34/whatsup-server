const Contact = require("../../../model/contact");
const AppError = require("../../../utils/appError");

const getConnections = async (req, res, next) => {
  console.log("getConnections function");

  const { userId } = req.params;

  try {
    const contact = await Contact.findOne(
      { userId },
      { connectWith: 1, _id: 0 }
    );

    if (!contact) return next(new AppError("No Contacts", 404));

    return res.status(200).json({
      status: "success",
      connectWith: contact.connectWith,
    });
  } catch (error) {
    next(new AppError("Server Error", 500));
  }
};

module.exports = getConnections;
