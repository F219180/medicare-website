/* global use, db */
// MongoDB Playground
// Make sure you are connected to enable completions and to be able to run a playground.

// Select the database to use.
use('medic');

// Insert a few documents into the patient collection.
db.getCollection('patient').insertMany([
  { 
    _id: UUID(), 
    username: "johnDoe", 
    password: "password1", 
    email: "john@example.com", 
    firstname: "John", 
    lastname: "Doe", 
    contact: "1234567890" 
  },
  { 
    _id: UUID(), 
    username: "janeDoe", 
    password: "password2", 
    email: "jane@example.com", 
    firstname: "Jane", 
    lastname: "Doe", 
    contact: "0987654321" 
  },
  // Add more patients as needed
  { 
    _id: UUID(), 
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


// Insert documents into the doctors collection with custom unique IDs.
db.getCollection('doctors').insertMany([
  {
    _id: UUID(), // Generates a UUID for each document
    username: "drSmith",
    password: "docpass1",
    email: "drsmith@example.com",
    firstname: "John",
    lastname: "Smith",
    contact: "9876543210",
    specialty: "Cardiology",
    qualifications: ["MD", "PhD in Cardiology"]
  },
  {
    _id: UUID(),
    username: "drJones",
    password: "docpass2",
    email: "drjones@example.com",
    firstname: "Cynthia",
    lastname: "Jones",
    contact: "9876501234",
    specialty: "Neurology",
    qualifications: ["MD", "MSc in Neuroscience"]
  },
  {
    _id: UUID(),
    username: "drAdams",
    password: "docpass3",
    email: "dradams@example.com",
    firstname: "Adrian",
    lastname: "Adams",
    contact: "9123456780",
    specialty: "Orthopedics",
    qualifications: ["MD", "Fellowship in Orthopedics"]
  }
]);

// Query to find all doctors in the collection.
const allDoctors = db.getCollection('doctors').find({});

// Print the query results to the MongoDB Playground output.
allDoctors.forEach(doc => {
  console.log(doc);
});


// Ensure only one admin document exists using upsert.
db.getCollection('admin').updateOne(
    { _id: "unique_admin_id" },  // Query part: looks for the document with this unique _id
    { $set: {
        username: "adminUser",
        password: "strongpassword123",
        email: "admin@example.com",
        role: "Administrator",
        contact: "1234567890"
    }},  // Update part: sets these values in the document
    { upsert: true }  // Upsert option: creates a new document if none exists
);

// Query to find the admin in the collection.
const admin = db.getCollection('admin').findOne({_id: "unique_admin_id"});

// Print the admin data to the MongoDB Playground output.
console.log(admin);
