const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


// Configure Nodemailer transporter (Gmail example)
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});



async function sendInquiryEmails(buyerName, buyerEmail, sellerName, sellerEmail, propertyAddress, platformName) {

    // Email to Seller
    const sellerMailOptions = {
        from: process.env.EMAIL,
        to: sellerEmail,
        subject: `Inquiry About Your Property at ${propertyAddress}`,
        text: `
Dear ${sellerName},

I'm writing to let you know that a potential buyer has expressed interest in your property located at ${propertyAddress}. They have inquired through our platform ${platformName} and are eager to learn more.

Buyer Name: ${buyerName}
Contact Information: ${buyerEmail} 

While we don't have specific questions from the buyer at this time, this is a great opportunity to showcase your property and answer any questions they may have. 

Please feel free to reach out to the buyer directly to schedule a viewing or provide additional details. We encourage open communication to facilitate a smooth transaction.

Thank you for listing your property with us. We are here to support you throughout the process.

Sincerely,
Gracy Gupta
Presidio Real Estate
    `
    };

    // Email to Buyer
    const buyerMailOptions = {
        from: process.env.EMAIL,
        to: buyerEmail,
        subject: `Your Inquiry About ${propertyAddress}`,
        text: `
Dear ${buyerName},

Thank you for your interest in the property located at ${propertyAddress}. We have notified the seller of your inquiry.

The seller will be in touch with you shortly to answer any questions you may have and potentially schedule a viewing. In the meantime, if you have any specific questions or requests, please feel free to reply to this email, and we will forward them to the seller.

We appreciate your interest and wish you all the best in your property search.

Sincerely,
Gracy Gupta
Presidio Real Estate
    `
    };

    try {
        await transporter.sendMail(sellerMailOptions);
        console.log('Inquiry email sent to seller');
        await transporter.sendMail(buyerMailOptions);
        console.log('Inquiry email sent to buyer');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error for handling in your application
    }
}

module.exports = { sendInquiryEmails };
