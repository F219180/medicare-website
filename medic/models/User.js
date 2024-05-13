const { MongoClient } = require('mongodb');
const { model } = require('mongoose');

class User {

    async connectDb() {
        try {
           

            const client = new MongoClient(mongoUrl);

            await client.connect();
            console.log("Connected successfully to MongoDB");
            return client.db(dbName);
        } catch (err) {
            console.error("Failed to connect to MongoDB", err);
            return null;
        }
    }

    async findUserInCollections(db, email) {
        const collections = ['patient', 'doctors', 'admin'];
        for (let collectionName of collections) {
            const user = await db.collection(collectionName).findOne({ email: email });
            if (user) return { user, collectionName };
        }
        return null;
    }

    async  findUsername(db, collectionName, email) {
        try {
            const user = await db.collection(collectionName).findOne({ email: email });
            if (user) {
                return user.username;
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error finding username:", error);
            throw error;
        }
    }
    
}

module.exports = User;