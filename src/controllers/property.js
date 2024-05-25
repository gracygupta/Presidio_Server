const Property = require("../models/property");
const multer = require("multer");
const User = require("../models/user");
const fs = require("fs");

// Set up multer storage for uploading images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./propertyImages/");
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
  // limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("images", 3); // Allow up to 3 images, with input field name 'images'

// Add Property API with multiple image upload
exports.addProperty = async (req, res) => {
  console.log(req.body);
  try {
    const owner = await User.findById(req.body.ownerId);
    console.log(owner);
    if (!owner || !owner.role == "seller") {
      return res.status(400).json({
        success: false,
        error: "Invalid owner ID or owner is not a seller",
      });
    }

    const location = JSON.parse(req.body.location);
    console.log(location);

    // Construct property object
    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      place: req.body.place,
      area: req.body.area,
      numberOfBedrooms: req.body.numberOfBedrooms,
      numberOfBathrooms: req.body.numberOfBathrooms,
      location: location,
      amenities: req.body.amenities || [],
      images: req.files.map((file) => ({
        originalName: file.originalname,
        url: file.path,
        key: file.filename,
      })),
      rent: req.body.rent,
      owner: req.body.ownerId,
    });

    // Save the property to the database
    await property.save();

    res
      .status(201)
      .json({ success: true, message: "Property Added", property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .sort({ createdAt: -1 }) // Sort by time in descending order
      .limit(50); // Limit to 100 results

    if (properties.length === 0) {
      return res.status(200).json({ message: "No Properties Found" });
    }

    // Iterate through each property and encode images to binary
    const propertiesWithImagesAsBinary = properties.map((property) => {
      // Iterate through images array of each property
      const imagesAsBinary = property.images.map((image) => {
        // Read image file as binary data
        const imageData = fs.readFileSync(`propertyImages/${image.key}`, {
          encoding: "base64",
        });
        return {
          originalName: image.originalName,
          data: imageData,
        };
      });

      return {
        ...property._doc,
        images: imagesAsBinary,
      };
    });

    res.status(200).json({
      success: true,
      message: "Recent 100 Properties Fetched with Images",
      properties: propertiesWithImagesAsBinary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getOwnedProperty = async (req, res) => {
  const owner = req.params.id;
  try {
    const properties = await Property.find({ owner }).sort({ createdAt: -1 });

    if (properties.length === 0) {
      return res.status(200).json({ message: "No Properties Found" });
    }

    const propertiesWithImagesAsBinary = properties.map((property) => {
      const imagesAsBinary = property.images.map((image) => {
        const imageData = fs.readFileSync(`propertyImages/${image.key}`, {
          encoding: "base64",
        });
        return {
          originalName: image.originalName,
          data: imageData,
        };
      });

      return {
        ...property._doc,
        images: imagesAsBinary,
      };
    });
    console.log("properties", properties);
    res
      .status(200)
      .json({ success: true, properties: propertiesWithImagesAsBinary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
