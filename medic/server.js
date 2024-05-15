const express = require('express');

const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const { scheduleMeet } = require('./controllers/meet');
const adminController = require('./controllers/adminController');


const signInController = require('./controllers/signInController');
const signUpController = require('./controllers/signUpController');
const resetPasswordController = require('./controllers/resetPasswordController');
const emailVerificationController = require('./controllers/emailVerificationController');
const storingMeetingInPaitentDb=require('./controllers/storingMeetingInPaitentDbController');
const adminController = require('./controllers/adminController');
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


app.use(express.urlencoded({ extended: true }));

// GET route to serve the HTML file
app.get('/schedule-meet', (req, res) => {
    res.sendFile(__dirname + '/schedule.html');
});

// POST route to handle scheduling the meeting
app.post('/schedule-meet', scheduleMeet);


app.post('/StoreMeetingInPaitentMeetingTable',storingMeetingInPaitentDb.StoreMeetingOfPatient);

// yeh aur requiree
app.get('/admin', adminController.getAdminDashboard);
app.post('/admin/delete', adminController.deleteDocument);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});











