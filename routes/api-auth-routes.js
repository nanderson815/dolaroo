"use strict";
const admin = require("../middleware/authServerCommon");
const requiresLogin = require('../middleware/requiresLogin.js');

module.exports = function (app) {

    // Authorization Express Error Handler If nt authorized return
    app.use(function (err, req, res, next) {
        console.error(`Error: ${err}`);
        res.status(401).json(`Auth Error Caught in Server: ${err}`);
    });

    // Route for getting user's custom claims
    app.get("/api/auth/getClaims/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            admin.auth().getUser(uid).then((user) => {
                // console.log(`Retrieved users custom claims: ${JSON.stringify(user, null, 4)}`);
                res.json(user);
            }).catch(err => {
                // none found should be ignored
                if (/is no user/.test(err)) {
                    res.json(user);
                } else {
                    res.status(404).json(`Error caught in app.get("/api/auth/getClaims/${uid}" ${err}`); 
                }       
            });

        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/setAdmin..." ${err}`);
        }
    }); // Route

    // Route for making user adin
    app.post("/api/auth/setAdmin/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            if (req.user && !!req.user.admin ) {
                    // set the claim for the user who's uid is passed
                    // Note, this is the uid of the user to make admin (NOT the auth users uid)
                    admin.auth().setCustomUserClaims(uid, { admin: true }).then(() => {
                        res.json(uid);
                    });
            }
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/setAdmin..." ${err.errors[0].message}`);
        }
    }); // Route

    app.post("/api/auth/setCashier/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            if (req.user && !!req.user.admin ) {
                // set the claim for the user who's uid is passed
                // Note, this is the uid of the user to make admin (NOT the auth users uid)
                admin.auth().setCustomUserClaims(uid, { cashier: true }).then(() => {
                    res.json(uid);
                });
            }
        } 
        catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/setCashier..." ${err.errors[0].message}`);
        }
    }); // Route

    // Route for making user adin
    app.post("/api/auth/deleteUser/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            if (req.user && !!req.user.admin ) {
                // delete the user
                admin.auth().deleteUser(uid)
                .then(() => {
                    console.log('Successfully deleted auth user');
                    res.json();
                })
                .catch((err) => {
                    if (/is no user/.test(err)) {
                        res.json();
                    } else {
                        console.error('Error deleting auth user:', error);
                        res.status(404).json(`Error caught in app.get("/api/auth/getClaims/${uid}" ${err}`); 
                    }       
                });
            } else {
                res.status(401).json(`Must be admin to delete user`);
            }
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/deleteUser/:uid..." ${err.errors[0].message}`);
        }
    }); // Route


};