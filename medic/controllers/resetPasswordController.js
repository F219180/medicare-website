const User = require('../models/User');
const reset = require("./emailVerificationController");
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.resetPasswordPage = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    const user = new User();

    try {
        const db = await user.connectDb();

        if (!db) {
            return res.status(500).send("Failed to connect to the database.");
        }

        if (!verificationCode) {
            const result = await user.findUserInCollections(db, email);
            if (!result) {
                return res.status(404).send({ message: "No user found with this email." });
            }

            const code = await reset.sendCode(req, res); // Send verification code
            await db.collection('passwordResetCodes').insertOne({ email, code });

            return; // No need to send response here, it's already handled in sendCode
        } else {
            const resetCode = await db.collection('verificationCodes').findOne({ code: verificationCode });
            if (!resetCode) {
                return res.status(404).send({ message: "Invalid or expired verification code." });
            }

            const { collectionName } = await user.findUserInCollections(db, resetCode.email);

            const result = await db.collection(collectionName).updateOne(
                { email: resetCode.email },
                { $set: { password: bcrypt.hashSync(newPassword, saltRounds) } }
            );

            await db.collection('passwordResetCodes').deleteOne({ code: verificationCode });

            return res.status(200).send({ message: "Password reset successfully." });
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).send({ error: "An error occurred while resetting the password." });
    }
};
