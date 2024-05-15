const { MongoClient } = require('mongodb');
const { model } = require('mongoose');

class User {

    async connectDb() {
        try {
            const mongoUrl = '';
         const dbName = '';

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

    async  findUserSpecialization(db, collectionName, email) {
        try {
            const user = await db.collection(collectionName).findOne({ email: email });
            if (user) {
                return user.specialty;
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error finding Specialization:", error);
            throw error;
        }
    }
    
    async  findAlldoctersFreeSlot(db, collectionName) {
        try {
            const alldocFreeslotObj = await db.collection(collectionName).find().toArray();
            if (alldocFreeslotObj) {
                return alldocFreeslotObj;
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error finding alldocFreeslot:", error);
            throw error;
        }
    }

    async  FindUpcomingMeetingsForP(db, collectionName,email) {
        try {
            const allMeetingObj = await db.collection(collectionName).find({patinetEmail:email}).toArray();
            if (allMeetingObj.length>0) {
                return allMeetingObj;
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error finding Upcomingmeetings:", error);
            throw error;
        }
    }

    async  FindUpcomingMeetingsForD(db, collectionName,email) {
        try {
            const allMeetingObj = await db.collection(collectionName).find({doctorEmail:email}).toArray();
            if (allMeetingObj.length>0) {
                return allMeetingObj;
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error finding Upcomingmeetings:", error);
            throw error;
        }
    }

//ISKO COPY KRNA SOHAIBBB
async findUserEmail(db, email) {
    try {
        const user = await db.collection('admin').findOne({ email: email });
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error finding admin email:", error);
        throw error;
    }
}

async findAllData(db) {
    const collections = ['patient', 'doctors', 'admin'];
    const allData = {};
    try {
        for (let collectionName of collections) {
            const collectionData = await db.collection(collectionName).find({}).toArray();
            allData[collectionName] = collectionData;
        }
        return allData;
    } catch (error) {
        console.error("Error fetching data from all collections:", error);
        throw error;
    }
}

///YAHHAN TKKK 



}

module.exports = User;