const { google } = require('googleapis');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

const timeZone = 'Asia/Karachi'; // Pakistan time zone

let credentials;

fs.readFile('old.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    credentials = JSON.parse(content);
    authorize(credentials);
});

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client({
        clientId: client_id,
        clientSecret: client_secret,
        redirectUri: redirect_uris[0]
    });

    fs.readFile('token.json', (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
    });
    console.log('Authorize this app by visiting this url:', authUrl);
}

function scheduleEvent(auth, dateTime, callback) {
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
        summary: 'Google Meet Event',
        description: 'This is a Google Meet event scheduled via Node.js',
        start: {
            dateTime: dateTime.toISOString(), // Convert JavaScript Date object to ISO string
            timeZone: timeZone,
        },
        end: {
            dateTime: dateTime.toISOString(), // Convert JavaScript Date object to ISO string
            timeZone: timeZone,
        },
        conferenceData: {
            createRequest: {
                requestId: 'your-unique-id',
            },
        },
    };
    calendar.events.insert(
        {
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        },
        (err, res) => {
            if (err) return callback(err, null);
            const meetingLink = res.data.hangoutLink;
            callback(null, meetingLink);
        }
    );
}

function scheduleMeet(req, res) {
    const dateTimeString = req.body.datetime;
    const dateTime = new Date(dateTimeString); // Parse date string into a Date object
    if (isNaN(dateTime.getTime())) {
        // Invalid date string
        return res.status(400).send('Invalid date and time format');
    }

    const oAuth2Client = new OAuth2Client({
        clientId: credentials.web.client_id,
        clientSecret: credentials.web.client_secret,
        redirectUri: credentials.web.redirect_uris[0]
    });
    fs.readFile('token.json', (err, token) => {
        if (err) return console.log('Error reading token file:', err);
        oAuth2Client.setCredentials(JSON.parse(token));
        scheduleEvent(oAuth2Client, dateTime, (err, meetingLink) => {
            if (err) {
                console.error('Error scheduling event:', err);
                res.status(500).send('Error scheduling event');
            } else {
                console.log('Event scheduled successfully:', meetingLink);
                res.send(`<h2>Meeting Scheduled Successfully!</h2><p>Meeting Link: <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>`);
                
            }
        });
    });
}

module.exports = {
    scheduleMeet
};
