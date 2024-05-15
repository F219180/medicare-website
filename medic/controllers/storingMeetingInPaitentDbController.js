
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.StoreMeetingOfPatient = async (req, res) => {
    const selectedMeetingIndex = req.body.selectedMeeting; 
    const selectedMeeting = allmeets[selectedMeetingIndex]; 

    const patinetEmail = req.body.email; 
    const doctorEmail=selectedMeeting.email;
    const userNameOfDocter=selectedMeeting.username;
    const userNameOfPatient=req.body.username;
    const specialty=selectedMeeting.specialty;

    const dateTime = selectedMeeting.dateTime; 
    const meetlink=selectedMeeting.meetingLink;
    const user= new User();
    const db = await user.connectDb();
    

    db.collection("DocterPatinetMeet").insertOne({
        doctorEmail:doctorEmail,patinetEmail:patinetEmail,userNameOfDocter:userNameOfDocter,userNameOfPatient:userNameOfPatient,
        specialty:specialty,
        dateTime:dateTime,meetingLink:meetlink,
    })

    
    db.collection("DocterMeetingSlots").deleteOne({ meetingLink: meetlink })


    res.send(`<h2>Meeting Scheduled Successfully!</h2></p>`);
    
    
    // Here you can store the selected meeting data in the patient's meeting table

    // Respond to the client if necessary
};
