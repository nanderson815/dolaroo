"use strict";
const admin = require("../middleware/authServerCommon");

// Backend functions for user DB in firestore and auth
class UserDB {
    static updateClaims (uid, claims, customClaims) {
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();
            const isAdmin = customClaims && customClaims.isAdmin ? true : false;
            const isCashier = customClaims && customClaims.isCashier ? true : false;
            const isUser = customClaims && customClaims.isUser ? true : false;
            const isNoAuth = !(isAdmin || isCashier || isUser);

            // update claims
            db.collection('users').doc(uid).set({
                claims: claims,
                isAdmin: isAdmin,
                isCashier: isCashier,
                isUser: isUser,
                isUser: isNoAuth
            }, {
                merge: true
            }).then(() => {
                console.log("completed");
                resolve();
            }).catch(err => {
                console.error(`error updating claims: ${err}`);
                reject(err);
            });
        });
    }

    static update (user) {
        console.log(`trying to update user in fb: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();;

            // update
            console.log("User updated, user=", user);
            db.collection('users').doc(user.uid).set({
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: `${user.firstName} ${user.lastName}`,
                phoneNumber: user.phoneNumber,
                uid: user.uid,
                email: user.email,
                photoURL: user.photoURL ? user.photoURL : ""
            }, {
                merge: true
            }).then(() => {
                console.log("completed");
                resolve();
            }).catch(err => {
                console.error(`error updating user: ${err}`);
                reject(err);
            });
        });
    }
}

module.exports = UserDB;