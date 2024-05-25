const Property = require('../models/property');
const User = require('../models/user');
const {sendInquiryEmails} = require('./emailController');

const inquireProperty = async (req, res) => {
    try {
        const {propertyId, userId} = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({success: false, error: "Property not found"});
        }
        const propertyAddress = property.title + ", " + property.location.city + ", " + property.location.state + " " + property.location.zip;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({success: false, error: "User not found"});
        }
        const buyerName = user.first_name + " " + user.last_name;
        const ownerId = property.owner;
        const owner = await User.findById(ownerId);
        if (!owner) {
            return res.status(404).json({success: false, error: "Owner not found"});
        }
        const ownerName = owner.first_name + " " + owner.last_name;

        // Save inquiry in the database
        const inquiry = new Inquiries({
            buyer: userId,
            property: propertyId
        });
        await inquiry.save();
        // Send inquiry emails to the buyer and owner
        await sendInquiryEmails( buyerName, user.email, ownerName, owner.email, propertyAddress, "Presidio");

        // Send Owner details to the user in the response
        res.status(200).json({success: true, message: "Inquiry sent", owner: owner});

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: "Server error"});
    }

}

module.exports = {inquireProperty};