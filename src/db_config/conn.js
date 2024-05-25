const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.DB_URI;

exports.dbConnect = () => {
  mongoose.set("strictQuery", true);

  //connecting with db
  mongoose
    .connect(`${uri}`)
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((err) => console.log(err));
};
