const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Controller method to process sign-up form submission
exports.signUpPage = async (req, res) => {
    const user = new User();
    const db = await user.connectDb();
    if (!db) {
        res.status(500).send("Failed to connect to the database.");
        return;
    }
    
    email=req.body.email;
    const result = await user.findUserInCollections(db, email);
    console.log(result)

    if (!(result)) {


        const { userType, password, verificationCode, ...otherData } = req.body;
        let collectionName = '';
        let responseMessage = '';

        if (userType === 'patient') {
            collectionName = 'patient';
            responseMessage = 'Patient registered successfully';
        } else if (userType === 'doctor') {
            collectionName = 'doctors';
            responseMessage = 'Doctor registered successfully';
        } else {
            res.status(400).send("Invalid user type.");
            return;
        }

        try {
            // Check if verification code is correct
            const verifiedCode = await db.collection('verificationCodes').findOne({ email: otherData.email, code: verificationCode });
            if (!verifiedCode) {
                res.status(401).send({ message: "Incorrect verification code." });
                return;
            }

            // Hash the password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const result = await db.collection(collectionName).insertOne({
                ...otherData,
                password: hashedPassword
            });

            res.status(201).send({ message: responseMessage, data: result });
        } catch (err) {
            console.error(`Error inserting data into ${collectionName}`, err);
            res.status(500).send(err.message);
        }
    }
    else{
        res.status(401).send({ message: "This Email is Already in Use" });

    }
};
