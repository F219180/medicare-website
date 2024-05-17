const User = require('../models/User');
const { ObjectId } = require('mongodb');

exports.getAdminDashboard = async (req, res) => {
    try {
        const user1 = new User();
        const db = await user1.connectDb();
        if (!db) {
            throw new Error("Failed to connect to the database.");
        }

        const collections = ['admin', 'doctors', 'patient', 'DoctorMeetingSlots', 'DoctorPatinetMeet'];
        let allData = {};

        for (const collectionName of collections) {
            allData[collectionName] = await db.collection(collectionName).find({}).toArray();
        }

        console.log("Fetched Data:", JSON.stringify(allData, null, 2));

        res.render('admin', { allData });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).send(error.message);
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const { collectionName, id } = req.body;
        console.log('Deleting document from collection:', collectionName);
        console.log('Document ID:', id);

        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid document ID");
        }

        const user1 = new User();
        const db = await user1.connectDb();
        if (!db) {
            throw new Error("Failed to connect to the database.");
        }

        const objectId = new ObjectId(id);

        // Log the collection and document details
        console.log(`Searching for document in collection: ${collectionName} with ID: ${objectId}`);

        // Find the document to delete
        const document = await db.collection(collectionName).findOne({ _id: objectId });
        if (!document) {
            throw new Error(`Document with ID ${id} not found in collection ${collectionName}.`);
        }

        console.log('Document found:', document);

        // Delete the main document
        const result = await db.collection(collectionName).deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            throw new Error(`Failed to delete document with ID ${id} from collection ${collectionName}.`);
        }

        // Additional deletion logic based on the collection name
        if (collectionName === 'doctors') {
            const deleteMeetingsResult = await db.collection('DoctorPatinetMeet').deleteMany({ doctorEmail: document.email });
            const deleteSlotsResult = await db.collection('DoctorMeetingSlots').deleteMany({ email: document.email });
            console.log('Deleted meetings result:', deleteMeetingsResult);
            console.log('Deleted slots result:', deleteSlotsResult);
        } else if (collectionName === 'patient') {
            const deletePatientMeetingsResult = await db.collection('DoctorPatinetMeet').deleteMany({ patientEmail: document.email });
            console.log('Deleted patient meetings result:', deletePatientMeetingsResult);
        }

        console.log(`Document with ID ${id} and related data deleted successfully.`);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting document:', error.message);
        res.status(500).send({ message: error.message });
    }
};

