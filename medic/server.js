// const express = require('express');
// const { MongoClient } = require('mongodb');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const nodemailer = require('nodemailer');
// const randomstring = require('randomstring');


// const cors = require('cors');


// const app = express();
// const port = 3000;
// const mongoUrl = 'mongodb+srv://syedaFatima:1234@cluster0.wlkeuw7.mongodb.net/';
// const dbName = 'medic';

// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// const client = new MongoClient(mongoUrl);

// async function connectDb() {
//     try {
//         await client.connect();
//         console.log("Connected successfully to MongoDB");
//         return client.db(dbName);
//     } catch (err) {
//         console.error("Failed to connect to MongoDB", err);
//         return null;
//     }
// }

// // Function to send verification code via email
// async function sendVerificationCode(email) {
//     const code = randomstring.generate(6); // Generate a random 6-digit code
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: 'f219212@cfd.nu.edu.pk', // Your email address
//             pass: '4434KALyar4434' // Your email password or app password
//         },
//         tls: {
//             rejectUnauthorized: false // Accept self-signed certificates
//         }
//     });

//     const mailOptions = {
//         from: 'f219212@cfd.nu.edu.pk',
//         to: email,
//         subject: 'Verification Code',
//         text: `Your verification code : ${code}`
//     };

//     await transporter.sendMail(mailOptions);
//     return code;
// }


// app.post('/signup', async (req, res) => {
//     const db = await connectDb();
//     if (!db) {
//         res.status(500).send("Failed to connect to the database.");
//         return;
//     }

//     const { userType, password, verificationCode, ...otherData } = req.body;
//     let collectionName = '';
//     let responseMessage = '';
    
//     if (userType === 'patient') {
//         collectionName = 'patient';
//         responseMessage = 'Patient registered successfully';
//     } else if (userType === 'doctor') {
//         collectionName = 'doctors';
//         responseMessage = 'Doctor registered successfully';
//     } else {
//         res.status(400).send("Invalid user type.");
//         return;
//     }

//     try {
//         // Check if verification code is correct
//         const verifiedCode = await db.collection('verificationCodes').findOne({ email: otherData.email, code: verificationCode });
//         if (!verifiedCode) {
//             res.status(401).send({ message: "Incorrect verification code." });
//             return;
//         }

//         // Hash the password before storing it in the database
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const result = await db.collection(collectionName).insertOne({
//             ...otherData,
//             password: hashedPassword
//         });

//         res.status(201).send({ message: responseMessage, data: result });
//     } catch (err) {
//         console.error(`Error inserting data into ${collectionName}`, err);
//         res.status(500).send(err.message);
//     }
// });

// // Endpoint to send verification code
// app.post('/send-verification-code', async (req, res) => {
//     const { email } = req.body;
//     console.log(email)
//     try {
//         const code = await sendVerificationCode(email);
//         await client.db(dbName).collection('verificationCodes').insertOne({ email, code });
//         res.status(200).send({ message: "Verification code sent successfully." });
//     } catch (err) {
//         console.error("Error sending verification code", err);
//         res.status(500).send(err.message);
//     }
// });


// async function findUserInCollections(db, email) {
//     const collections = ['patient', 'doctors', 'admin'];
//     for (let collectionName of collections) {
//         const user = await db.collection(collectionName).findOne({ email: email });
//         if (user) return { user, collectionName };
//     }
//     return null;
// }


// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const db = await connectDb();

//     if (!db) {
//         res.status(500).send("Failed to connect to the database.");
//         return;
//     }

//     try {
//         const result = await findUserInCollections(db, email);
//         if (!result) {
//             res.status(401).send({ message: "No user found with this email in any collections." });
//             return;
//         }

//         const { user, collectionName } = result;
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             res.status(200).send({ message: `Login successful! Found in ${collectionName}.` });
//         } else {
//             res.status(401).send({ message: "Incorrect password." });
//         }
//     } catch (err) {
//         console.error("Error during login", err);
//         res.status(500).send(err.message);
//     }
// });



// app.post('/reset-password', async (req, res) => {
//     const { email, verificationCode, newPassword } = req.body;
//     const db = await connectDb();

//     if (!db) {
//         res.status(500).send("Failed to connect to the database.");
//         return;
//     }

//     try {
//         if (!verificationCode) {
//             // If verification code is not provided, initiate password reset process

//             // Check if the user exists in any of the collections
//             const result = await findUserInCollections(db, email);
//             if (!result) {
//                 res.status(404).send({ message: "No user found with this email." });
//                 return;
//             }

//             // Send verification code to the user's email
//             const code = await sendVerificationCode(email);

//             // Save the verification code in the database for verification
//             await db.collection('passwordResetCodes').insertOne({ email, code });

//             res.status(200).send({ message: "Password reset initiated. Check your email for verification code." });
//         } else {
//             // If verification code is provided, verify code and update password

//             // Find the user based on verification code
//             const resetCode = await db.collection('passwordResetCodes').findOne({ code: verificationCode });
//             if (!resetCode) {
//                 res.status(404).send({ message: "Invalid or expired verification code." });
//                 return;
//             }

//             // Find the collection name for the user
//             const { collectionName } = await findUserInCollections(db, resetCode.email);

//             // Update user's password in the corresponding collection
//             const result = await db.collection(collectionName).updateOne(
//                 { email: resetCode.email },
//                 { $set: { password: bcrypt.hashSync(newPassword, saltRounds) } }
//             );

//             // Remove the verification code from the database
//             await db.collection('passwordResetCodes').deleteOne({ code: verificationCode });

//             res.status(200).send({ message: "Password reset successfully." });
//         }
//     } catch (err) {
//         console.error("Error resetting password:", err);
//         res.status(500).send(err.message);
//     }
// });


// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}/`);
// });






























const express = require('express');

const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const signInController = require('./controllers/signInController');
const signUpController = require('./controllers/signUpController');
const resetPasswordController = require('./controllers/resetPasswordController');
const emailVerificationController = require('./controllers/emailVerificationController');


const cors = require('cors');


const app = express();
const port = 3000;


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.post('/signup', signUpController.signUpPage);

// Endpoint to send verification code
app.post('/send-verification-code', emailVerificationController.sendCode);

app.post('/login', signInController.signInPage);

app.post('/reset-password', resetPasswordController.resetPasswordPage);

// app.get('/login', signInController.signIn);

// app.get('/', landingPageController.landingPage);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});











