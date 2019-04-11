"use strict";
const admin = require("../middleware/authServerCommon");

class UserDB {
    static updateClaims (uid, claims) {
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();;

            // update claims
            db.collection('users').doc(uid).set({
                claims: claims
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
                claims: user.claims ? user.claims : "",
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