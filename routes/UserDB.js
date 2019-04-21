"use strict";
const admin = require("../middleware/authServerCommon");

// Backend functions for user DB in firestore and auth
class UserDB {
    static updateClaims (uid, claims, customClaims) {
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();
            // Init claims for primary since you can be multiple
            let updateFields = {claims: claims};

            // Only *set* claims passed so users can be more than one
            if (customClaims && customClaims.isAdmin != null) updateFields.isAdmin = customClaims.isAdmin;
            if (customClaims && customClaims.isCashier != null) updateFields.isCashier = customClaims.isCashier;
            if (customClaims && customClaims.isBanker != null) updateFields.isBanker = customClaims.isBanker;
            if (customClaims && customClaims.isUser != null) updateFields.isUser = customClaims.isUser;

            // update claims
            db.collection('users').doc(uid).set(updateFields,
                { merge: true }
            ).then(() => {
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