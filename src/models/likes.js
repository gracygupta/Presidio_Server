const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Likes = mongoose.model("likes", likesSchema);

module.exports = Likes;
