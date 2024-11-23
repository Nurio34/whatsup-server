const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const app = require("./app");

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("Successfull DB Connection"))
  .catch((e) => console.log(e));

app.listen(PORT, (e) => console.log(`Server running at port ${PORT}`));
