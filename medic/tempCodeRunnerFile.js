/* global use, db */
// MongoDB Playground
// Make sure you are connected to enable completions and to be able to run a playground.

// Select the database to use.
use('medic');

// Insert a few documents into the patient collection.
db.getCollection('patient').insertMany([
  { 
    username: "johnDoe", 
    password: "password1", 
    email: "john@example.com", 
    firstname: "John", 
    lastname: "Doe", 
    contact: "1234567890" 
  },
  { 
    username: "janeDoe", 
    password: "password2", 
    email: "jane@example.com", 
    firstname: "Jane", 
    lastname: "Doe", 
    contact: "0987654321" 
  },
  // Add more patients as needed
  { 
    username: "samSmith", 
    password: "password3", 
    email: "sam@example.com", 
    firstname: "Sam", 
    lastname: "Smith", 
    contact: "1234567891" 
  }
]);

// Query to find all patients in the collection.
const allPatients = db.getCollection('patient').find({});

// Print the query results to the MongoDB Playground output.
allPatients.forEach(doc => {
  console.log(doc);
});
