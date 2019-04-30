"use strict";
require("dotenv");
const path = require("path");

// Need to use firebase admin to get at firebase stuff in node
// This will also be used to get a firestore cloud storage on the server
// This gives us access to the *client side APIs* in firebase on node.
const admin = require("firebase-admin");
const storageBucket = "project3-noahpauljj-fintech2.appspot.com";
const databaseURL = "https://project3-noahpauljj-fintech2.firebaseio.com";

// if  GOOGLE_APPLICATION_CREDENTIALS set, use this file, else, dont send cred since App Engine finds it
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccount = require(path.join(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS));
    console.log(`Deployed Local ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: databaseURL,
        storageBucket: storageBucket
    });
} else if (process.env.HEROKU_GOOGLE_DEPLOYMENT) {
    console.log("Deployed HEROKU_GOOGLE_DEPLOYMENT");
    const serviceAccount = {
        "type": "service_account",
        "project_id": "project3-noahpauljj-fintech2",
        "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
        "private_key":  process.env.GOOGLE_PRIVATE_KEY,
        "client_email": "firebase-adminsdk-f363h@project3-noahpauljj-fintech2.iam.gserviceaccount.com",
        "client_id": "104612084028429486586",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-f363h%40project3-noahpauljj-fintech2.iam.gserviceaccount.com"
    };
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: databaseURL,
        storageBucket: storageBucket
    });
} else {
    console.log("Deployed To Google Cloud");
    admin.initializeApp({
        databaseURL: databaseURL,
        storageBucket: storageBucket
    });
}

module.exports = admin;