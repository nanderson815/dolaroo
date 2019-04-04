"use strict";

const requiresLogin = require('../middleware/requiresLogin.js');

module.exports = function (app) {

    // Authorization Express Error Handler If nt authorized return
    app.use(function (err, req, res, next) {
        console.error(`Error: ${err}`);
        res.status(401).json(`Auth Error Caught in Server: ${err}`);
    });

    // Route for getting all photos from photos table for the currently authenticated user
    app.get("/api/auth/setAdmin", requiresLogin, (req, res) => {
        try {
            admin.auth().setCustomUserClaims(req.uid, {
                admin: true
            }).then(() => {
                // The new custom claims will propagate to the user's ID token the
                // next time a new one is issued.
            });
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.get("/api/auth/setAdmin..." ${err.errors[0].message}`);
        }
    }); // Route

    // Route for getting all photos from photos table for the currently authenticated user
    app.get("/api/auth/setCashier", requiresLogin, (req, res) => {
        try {
            admin.auth().verifyIdToken(req.user).then((claims) => {
                if (claims.admin === true) {
                  // Allow access to requested admin resource.
                  admin.auth().setCustomUserClaims(uid, {
                    cashier: true
                    }).then(() => {
                        // The new custom claims will propagate to the user's ID token the
                        // next time a new one is issued.
                    });    
                }
            });
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.get("/api/auth/setCashier..." ${err.errors[0].message}`);
        }
    }); // Route

};