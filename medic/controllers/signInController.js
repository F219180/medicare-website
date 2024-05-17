const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signInPage = async (req, res) => {
    const user1 = new User();
    const { email, password } = req.body;
    const db = await user1.connectDb();

    if (!db) {
        res.status(500).send("Failed to connect to the database.");
        return;
    }

    try {
        const result = await user1.findUserInCollections(db, email);
        if (!result) {
            res.status(401).send({ message: "No user found with this email in any collections." });
            return;
        }

        const { user, collectionName } = result;
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            if (collectionName === "patient") {
                username = await user1.findUsername(db, collectionName, email);
                allmeets = await user1.findAlldoctersFreeSlot(db, "DocterMeetingSlots");
                upcomingMeetings = await user1.FindUpcomingMeetingsForP(db, "DocterPatinetMeet", email);
                prescriptions = await user1.findPrescriptionsByPatientEmail(db, email);

                 res.render('patient.ejs', { username: username, email: email, allmeets: allmeets, upcomingMeetings: upcomingMeetings,prescriptions: prescriptions });


            } else if (collectionName === "doctors") {
                username = await user1.findUsername(db, collectionName, email);
                specialty = await user1.findUserSpecialization(db, collectionName, email);
                upcomingMeetings = await user1.FindUpcomingMeetingsForD(db, "DocterPatinetMeet", email);

                patientEmails = upcomingMeetings.length > 0 ? upcomingMeetings.map(meeting => meeting.patinetEmail) : [];
                medicalRecords = patientEmails.length > 0 ? await user1.findMedicalRecordsByEmails(db, patientEmails) : [];

                res.render('doctor.ejs', { username: username, email: email, specialty: specialty, upcomingMeetings: upcomingMeetings, medicalrecords: medicalRecords });
            } else if (collectionName === "admin") {
                const adminUser = await user1.findUserEmail(db, email);
                const allData = await user1.findAllData(db);
                allmeets = await user1.findAlldoctersFreeSlot(db, "DocterMeetingSlots");
                upcomingMeetings = await user1.findmeet(db, "DocterPatinetMeet");
                res.render('admin.ejs', { adminUser, allData });
            }
        } else {
            res.status(401).send({ message: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error during login", err);
        res.status(500).send(err.message);
    }
};

exports.addMedicalRecord = async (req, res) => {
    const { recordEmail, bp, description } = req.body;
    const user1 = new User();
    const db = await user1.connectDb();

    if (!db) {
        res.status(500).json({ success: false, message: "Failed to connect to the database." });
        return;
    }

    try {
        await db.collection('medrec').insertOne({ email: recordEmail, bp, description });
        res.status(200).json({ success: true, message: "Medical record added successfully." });
    } catch (error) {
        console.error("Error adding medical record:", error);
        res.status(500).json({ success: false, message: "Error adding medical record." });
    }
};

exports.getDoctorDashboard = async (req, res) => {
    try {
        const user1 = new User();
        const db = await user1.connectDb();
        if (!db) {
            throw new Error("Failed to connect to the database.");
        }

        const { username, email, specialty } = req.body;

        // Fetch upcoming meetings for the doctor
        const upcomingMeetings = await user1.FindUpcomingMeetingsForD(db, "DoctorPatinetMeet", email) || [];

        // Ensure upcomingMeetings is an array
        const patientEmails = upcomingMeetings.length > 0 ? upcomingMeetings.map(meeting => meeting.patinetEmail) : [];

        // Fetch medical records for the relevant patients
        const medicalRecords = patientEmails.length > 0 ? await user1.findMedicalRecordsByEmails(db, patientEmails) : [];

        res.render('doctor.ejs', { username, email, specialty, upcomingMeetings, medicalRecords });
    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        res.status(500).send(error.message);
    }
};

exports.addPrescription = async (req, res) => {
    const { meetingId, doctorSignature, prescription, patientEmail } = req.body;
    const user1 = new User();
    const db = await user1.connectDb();

    if (!db) {
        res.status(500).json({ success: false, message: "Failed to connect to the database." });
        return;
    }

    try {
        await db.collection('prescription').insertOne({
            meetingId,
            doctorSignature,
            prescription,
            patientEmail,
            date: new Date() // Store the current system date
        });
        res.status(200).json({ success: true, message: "Prescription added successfully." });
    } catch (error) {
        console.error("Error adding prescription:", error);
        res.status(500).json({ success: false, message: "Error adding prescription." });
    }
};


exports.getPatientDashboard = async (req, res) => {
    try {
        const user1 = new User();
        const db = await user1.connectDb();
        if (!db) {
            throw new Error("Failed to connect to the database.");
        }

        const { email } = req.body;

        // Fetch prescriptions for the patient
        const prescriptions = await user1.findPrescriptionsByPatientEmail(db, email);

        res.render('patient.ejs', { username: req.body.username, email, prescriptions });
    } catch (error) {
        console.error('Error fetching patient dashboard data:', error);
        res.status(500).send(error.message);
    }
};