"use strict";
const admin = require("../middleware/authServerCommon");
const requiresLogin = require('../middleware/requiresLogin.js');
const UserDB = require("./UserDB");

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
            res.status(500).json(`Error caught in route app.get("/api/auth/getClaims/:uid"..." ${err}`);
        }
    }); // Route

    // Route for making user adin
    app.post("/api/auth/setAdmin/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            // to get initial admin setup I temp dispable the check
            // if (req.user) {
            if (req.user && !!req.user.admin) {
                // set the claim for the user who's uid is passed
                // Note, this is the uid of the user to make admin (NOT the auth users uid)
                admin.auth().setCustomUserClaims(uid, {
                    admin: true
                }).then(async () => {
                    // now update firestore
                    await UserDB.updateClaims(uid, "admin", {isAdmin: true});
                    res.json(uid);
                });
            } else {
                res.status(401).json(`Must be admin to make someone admin..."`);
            }
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/setAdmin..." ${err}`);
        }
    }); // Route

    const helperGetUser = (uid) => {
        return new Promise((resolve, reject) => {
            admin.auth().getUser(uid).then((user) => {
                return(resolve(user));
            }).catch(err => {
                return(reject(err));
            });
        });
    }

    app.post("/api/auth/setCashier/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            if (req.user && !!req.user.admin) {
                // check if user is admin and if they are, do change to cashier since admin can do that
                helperGetUser(uid).then(user => {
                    if (user.claims && user.isAdmin) {
                        // Do NOT change admin to cashier
                        res.status(200).json("User is already admin who also has cashier priveleges");
                    } else {
                        admin.auth().setCustomUserClaims(uid, {
                            cashier: true
                        }).then(async () => {
                            await UserDB.updateClaims(uid, "cashier", {isCashier: true});
                            res.json(uid);
                        });
                    }
                }).catch(err => {
                    // ignore since it is OK if couldnt set for most reasons
                    res.status(200).json("OK");
                })
            } else {
                res.status(401).json(`Must be admin to make someone cashier..."`);
            }

        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.post("/api/auth/setCashier..." ${err}`);
        }
    }); // Route

    // Route for making user adin
    app.post("/api/auth/deleteUser/:uid", requiresLogin, (req, res) => {
        let uid = req.params.uid;
        try {
            // Authorize the current user
            if (req.user && !!req.user.admin) {
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