
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/User');



// Function to send verification code via email
async function sendVerificationCode(email) {
    const code = randomstring.generate(6); // Generate a random 6-digit code
    const transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '', // Your email address
            pass: '' // Your email password or app password
        },
        tls: {
            rejectUnauthorized: false // Accept self-signed certificates
        }
    });

    const mailOptions = {
        from: 'k',
        to: email,
        subject: 'Verification Code',
        text: `Your verification code : ${code}`
    };

    await transporter.sendMail(mailOptions);
    return code;
}


exports.sendCode = async (req, res) => {
    const { email } = req.body;
    const user = new User();
    
    try {
        // Connect to the MongoDB database
        const db = await user.connectDb();

        // Generate verification code
        const code = await sendVerificationCode(email);
        console.log(code)
        // Insert verification code into the database
        await db.collection('verificationCodes').insertOne({ email, code });

        // Send response
        res.status(200).send({ message: "Verification code sent successfully." });
    } catch (err) {
        console.error("Error sending verification code", err);
        res.status(500).send(err.message);
    }
};