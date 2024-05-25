const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquiriesSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Inquiries = mongoose.model("Inquiries", inquiriesSchema);

module.exports = Inquiries;
