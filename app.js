const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const error = require("./controller/error");

const AuthRouter = require("./route/auth");
const UserRouter = require("./route/user");
const ContactRouter = require("./route/contact");
const ChatRouter = require("./route/chat");

const app = express();

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://whatsup-lime-rho.vercel.app"],
    credentials: true,
  })
);

app.use(helmet());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/contact", ContactRouter);
app.use("/api/v1/chat", ChatRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(error);

module.exports = app;
