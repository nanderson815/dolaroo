const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config();
const port = process.env.PORT || 5000;

const mongoose = require("mongoose");
const axios = require("axios");

// Require all models
//const db = require("./models");

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// connect mongoose
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-1qm5r.gcp.mongodb.net/fintechdb?retryWrites=true`;
// Connect to the Mongo DB ATLAS
mongoose.connect(uri, {
    useNewUrlParser: true
});

// // Connect to the Mongo DB LOCAL
// mongoose.connect("mongodb://localhost:27017/fintechdb", {
//     useNewUrlParser: true
// });


//Route setup
app.get('/api/user', (req, res) => {
    res.json({
        name: "NoahPaulJJ",
        email: "NoahPaulJJ@gmail.com"
    });
})

// Make sure our React files are being served by our Express server.
// Serve static files from the React frontend app
// app.use(express.static(path.join(__dirname, 'client', 'build')));

// app.get('*', function (req, res) {
//     const index = path.join(__dirname, 'client', 'build', 'index.html');
//     res.sendFile(index);
// });

// //production mode - serve from build dir, else serve from public
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', function (req, res) {
        const index = path.join(__dirname, 'client', 'build', 'index.html');
        res.sendFile(index);
    });
} else {
    //build mode
    app.use(express.static(path.join(__dirname, 'client', 'public')));

    app.get('*', (req, res) => {
        console.log(path.join(__dirname, '/client/public/index.html'));
        res.sendFile(path.join(__dirname + '/client/public/index.html'));
    })
}

//Start server
app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});