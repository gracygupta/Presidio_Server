const Property = require("../models/property");
const User = require("../models/user");
const Likes = require("../models/Likes");

// like or unlike a property
const likeProperty = async (req, res) => {
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

        const existingLike = await Likes.findOne({ property: propertyId, buyer: userId });
        if (existingLike) {
            await existingLike.remove();
            return res.status(200).json({ success: true, message: "Property unliked" });
        }

        await like.save();
        res.status(201).json({ success: true, message: "Property liked" });
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

const getAllLikesProperty = async (req, res) => {
    try {
        const likes = await Likes.find({ property: req.params.propertyId });
        res.status(200).json({ success: true, likes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

module.exports = { likeProperty, getAllLikesProperty };
