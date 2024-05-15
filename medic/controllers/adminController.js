const User = require('../models/User');
const { ObjectId } = require('mongodb');

exports.getAdminDashboard = async (req, res) => {
    try {
        const user1 = new User();
        const db = await user1.connectDb();
        if (!db) {
            throw new Error("Failed to connect to the database.");
        }

        const collections = ['admin', 'doctors', 'passwordResetCodes', 'patient', 'users', 'verificationCodes'];
        let allData = {};

        for (const collectionName of collections) {
            allData[collectionName] = await db.collection(collectionName).find({}).toArray();
        }

        const adminUser = { email: 'admin@example.com', username: 'AdminUser', contact: '1234567890', role: 'admin' }; // Mock admin user details
        res.render('admin', { adminUser, allData });
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

        const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error("Document not found or already deleted.");
        }

        console.log('Document deleted successfully.'); // Log successful deletion
        res.sendStatus(200); // Send success response
    } catch (error) {
        console.error('Error deleting document:', error.message);
        res.status(500).send({ message: error.message }); // Send error response
    }
};
