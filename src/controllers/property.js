const Property = require("../models/property");
const multer = require("multer");

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
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("images", 3); // Allow up to 3 images, with input field name 'images'

// Add Property API with multiple image upload
exports.addProperty = async (req, res) => {
  try {
    // Upload images
    await new Promise((resolve, reject) => {
      upload(req, res, function (err) {
        console.log(err);
        if (err instanceof multer.MulterError) {
          return reject({
            status: 400,
            success: false,
            message: "File size limit exceeded or invalid file type",
          });
        } else if (err) {
          return reject({ status: 400, message: err.message });
        }
        resolve();
      });
    });

    // Validate owner
    const owner = await User.findById(req.body.ownerId);
    if (!owner || !owner.isSeller) {
      return res.status(400).json({
        success: false,
        error: "Invalid owner ID or owner is not a seller",
      });
    }

    // Construct property object
    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      place: req.body.place,
      area: req.body.area,
      numberOfBedrooms: req.body.numberOfBedrooms,
      numberOfBathrooms: req.body.numberOfBathrooms,
      location: {
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
      },
      // amenities: req.body.amenities || [],
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
