"use strict";
const admin = require("../middleware/authServerCommon");
const requiresLogin = require('../middleware/requiresLogin.js');

module.exports = function (app) {

    // Authorization Express Error Handler If nt authorized return
    app.use(function (err, req, res, next) {
        console.error(`Error: ${err}`);
        res.status(401).json(`Auth Error Caught in Server: ${err}`);
    });

    // Route for getting all photos from photos table for the currently authenticated user
    app.post("/api/auth/setAdmin/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Note, this is the uid of the usrer to make admin (NOT the auth users uid)
            admin.auth().setCustomUserClaims(uid, {admin: true}).then(() => {
                // The new custom claims will propagate to the user's ID token the
                // next time a new one is issued.
                res.json(uid);
            });
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.get("/api/auth/setAdmin..." ${err.errors[0].message}`);
        }
    }); // Route

    app.post("/api/auth/setCashier/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Note, this is the uid of the usrer to make admin (NOT the auth users uid)
            admin.auth().verifyIdToken(req.user).then((claims) => {
                if (claims.admin === true) {
                    admin.auth().setCustomUserClaims(uid, {cashier: true}).then(() => {
                        res.json(uid);
                    });
                }
            });
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.get("/api/auth/setAdmin..." ${err.errors[0].message}`);
        }
    }); // Route

};