const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const error = require("./controller/error");

const AuthRouter = require("./route/auth");

const app = express();

app.use(
    express.json({
        limit: "10kb",
    }),
);

app.use(helmet());

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    }),
);

app.use("/api/v1/auth", AuthRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server !`, 404));
});

app.use(error);

module.exports = app;
