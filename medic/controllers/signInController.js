
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// exports.signIn = async (res, res) => {
//     res.sendFile(path.join(__dirname, './views/html/login.html'));
// };

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
        // console.log(result);
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {


            if (collectionName == "patient") {
                username = await user1.findUsername(db, collectionName, email);
                allmeets = await user1.findAlldoctersFreeSlot(db, "DocterMeetingSlots");
                upcomingMeetings = await user1.FindUpcomingMeetingsForP(db, "DocterPatinetMeet", email);
                res.render('patient.ejs', { username: username, email: email, allmeets: allmeets, upcomingMeetings: upcomingMeetings });
            }
            else if (collectionName == "doctors") {

                username = await user1.findUsername(db, collectionName, email);
                specialty = await user1.findUserSpecialization(db, collectionName, email);
                upcomingMeetings = await user1.FindUpcomingMeetingsForD(db, "DocterPatinetMeet", email);
                res.render('doctor.ejs', { username: username, email: email, specialty: specialty, upcomingMeetings: upcomingMeetings });

            }
            else if (collectionName == "admin") {

                const adminUser = await user1.findUserEmail(db, email);
                const allData = await user1.findAllData(db);
                res.render('admin.ejs', { adminUser, allData });
            }
            //   res.status(200).send({ message: `Login successful! Found in ${collectionName}.` });

<<<<<<< HEAD
=======
                    username= await user1.findUsername(db,collectionName,email);
                    specialty= await user1.findUserSpecialization(db,collectionName,email);
                    console.log(username);
                    res.render('doctor.ejs', { username: username,email:email,specialty:specialty });
                    
        
                }

                //AIK ISKO COPY PASTE KRNA SHAREEF SOHAIB
                else  if(collectionName=="admin")
                {

                        const adminUser = await user1.findUserEmail(db, email);
                        const allData = await user1.findAllData(db);
                        res.render('admin.ejs', { adminUser, allData });
                }
                //YAHAN TKKKKKK

         //   res.status(200).send({ message: `Login successful! Found in ${collectionName}.` });
            
>>>>>>> 31644e2a9ff036a47f57ed931cb4fd80856890e6

        } else {
            res.status(401).send({ message: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error during login", err);
        res.status(500).send(err.message);
    }
};