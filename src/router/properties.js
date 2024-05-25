const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const utilController = require("../controllers/utilController");
const properties = require("../controllers/property");
const email = require("../controllers/emailController");
const likes = require("../controllers/likeProperty");
const inquire = require("../controllers/inquireProperty");
// Set up multer storage for uploading images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "propertyImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Set up multer upload instance for multiple files
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

router.post(
  "/properties",
  upload.array("images", 3), // Allow up to 3 images, with input field name 'images'
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("place").notEmpty().withMessage("Place is required"),
    body("area").isNumeric().withMessage("Area must be a number"),
    body("numberOfBedrooms")
      .isNumeric()
      .withMessage("Number of bedrooms must be a number"),
    body("numberOfBathrooms")
      .isNumeric()
      .withMessage("Number of bathrooms must be a number"),
    body("rent").isNumeric().withMessage("Rent must be a number"),
    body("ownerId").notEmpty().withMessage("Owner ID is required"),
  ],
  utilController.validateRequest,
  properties.addProperty
);

router.get("/properties", properties.getProperties);

// Like or unlike a property
router.post("/like", likes.likeProperty);

// Get all likes for a property
router.get("/property/:propertyId/likes", likes.getAllLikesProperty);

// Inquire about a property
router.post("/inquire", inquire.inquireProperty);

//Get owned properties
router.get("/properties/owned/:id", properties.getOwnedProperty);

module.exports = router;
