const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds the salt will go through

const app = express();
const port = 3000;
const mongoUrl = 'mongodb+srv://syedaFatima:1234@cluster0.wlkeuw7.mongodb.net/';
const dbName = 'medic';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const client = new MongoClient(mongoUrl);

async function connectDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        return client.db(dbName);
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        return null;
    }
}

app.post('/signup', async (req, res) => {
    const db = await connectDb();
    if (!db) {
        res.status(500).send("Failed to connect to the database.");
        return;
    }

    const { userType, password, ...otherData } = req.body;
    let collectionName = '';
    let responseMessage = '';

    if (userType === 'patient') {
        collectionName = 'patient'; // Correct collection name to 'patients'
        responseMessage = 'Patient registered successfully';
    } else if (userType === 'doctor') {
        collectionName = 'doctors';
        responseMessage = 'Doctor registered successfully';
    } else {
        res.status(400).send("Invalid user type.");
        return;
    }

    try {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await db.collection(collectionName).insertOne({
            ...otherData,
            password: hashedPassword  // Store the hashed password, not the plaintext
        });

        res.status(201).send({ message: responseMessage, data: result });
    } catch (err) {
        console.error(`Error inserting data into ${collectionName}`, err);
        res.status(500).send(err.message);
    }
});

async function findUserInCollections(db, email) {
    const collections = ['patient', 'doctors', 'admin'];
    for (let collectionName of collections) {
        const user = await db.collection(collectionName).findOne({ email: email });
        if (user) return { user, collectionName };
    }
    return null;
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await connectDb();

    if (!db) {
        res.status(500).send("Failed to connect to the database.");
        return;
    }

    try {
        const result = await findUserInCollections(db, email);
        if (!result) {
            res.status(401).send({ message: "No user found with this email in any collections." });
            return;
        }

        const { user, collectionName } = result;
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(200).send({ message: `Login successful! Found in ${collectionName}.` });
        } else {
            res.status(401).send({ message: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error during login", err);
        res.status(500).send(err.message);
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
