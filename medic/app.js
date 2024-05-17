const { google } = require('googleapis');
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const express = require('express');

const app = express();
const port = 3000;

// Sample time zone
const timeZone = 'America/New_York';
let credentials; // Define credentials globally

// Load client secrets from a local file.
fs.readFile('old.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    credentials = JSON.parse(content); // Store credentials globally
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(credentials);
});

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
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

function scheduleEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
        summary: 'Google Meet Event',
        description: 'This is a Google Meet event scheduled via Node.js',
        start: {
            dateTime: '2024-06-10T10:00:00',
            timeZone: timeZone,
        },
        end: {
            dateTime: '2024-06-10T11:00:00',
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
            if (err) return console.log('Error:', err);
            console.log('Event created: %s', res.data.htmlLink);
        }
    );
}

// Handle Google OAuth callback
app.get('/auth/google/callback', (req, res) => {
    const code = req.query.code;
    const oAuth2Client = new OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile('token.json', JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', 'token.json');
        });
        // Call the scheduleEvent function after successful authentication
        scheduleEvent(oAuth2Client);
    });
    res.send('Authentication successful! You can close this window.');
});

// API endpoint to initiate Google OAuth authentication
app.get('/auth/google', (req, res) => {
    const authUrl = authorize(credentials);
    res.redirect(authUrl);
});

// API endpoint to schedule Google Meet event
app.get('/schedule-meet', (req, res) => {
    res.send('Please authenticate using /auth/google to schedule a Google Meet event.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
