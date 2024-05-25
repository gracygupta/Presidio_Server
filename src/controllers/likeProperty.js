const Property = require("../models/property");
const User = require("../models/user");
const Likes = require("../models/Likes");


exports.likeProperty = async (req, res) => {
    try {
        const { propertyId, userId } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, error: "Property not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const like = new Likes({
            property: propertyId,
            seller: property.owner,
            buyer: userId,
        });

        const savedLike = await like.save();
        res.status(201).json({ success: true, message: "Property liked", like: savedLike });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}
