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











