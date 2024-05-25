const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    numberOfBedrooms: {
      type: Number,
      required: true,
    },
    numberOfBathrooms: {
      type: Number,
      required: true,
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      // Additional fields can be added as needed
    },
    amenities: [String], // Array of amenities (e.g., "parking", "pool", "gym")
    images: [
      {
        originalName: { type: String, required: true },
        url: { type: String, required: true },
        key: { type: String, required: true },
      },
    ], // Array of image URLs
    available: {
      type: Boolean,
      deafult: true,
    },
    nearbyPlaces: {
      hospitals: [String],
      colleges: [String],
    },
    rent: {
      type: Number,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
