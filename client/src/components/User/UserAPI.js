import Util from "../Util/Util"

class UserAPI {

    static getCurrentAuthUser = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            resolve(Util.getCurrentAuthUser());
        });
    }

    // get
    static getCurrentUser = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            Util.getCurrentAuthUser().then(autUser => {
                const uid = autUser.uid;
                // then get from firestore
                let docRef = db.collection("users").doc(uid);
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        // update
                        let user = doc.data();
                        resolve(user);
                    } else {
                        console.log("User not found in firestore");
                        resolve();
                    }
                }).catch(err => {
                    reject(`Error getting user in UserAPI.getCurrentUser ${err}`);
                });
            }).catch(err => {
                reject(`Error getting user in UserAPI.getCurrentUser ${err}`);
        });
    });
    }
    

    static addAuthUserToFirestore = (authUser) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            let docRef = db.collection("users").doc(authUser.user.uid);
            docRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        // update
                        console.log("User updated, authUser=", authUser);
                        return db.collection('users').doc(authUser.user.uid).update({
                            email: authUser.user.email
                        });
                    }
                    // cretae if not existing
                    console.log("New user created", authUser);
                    return db.collection('users').doc(authUser.user.uid).set({
                        displayName: authUser.user.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email
                    });
                })
                .then(() => {
                    console.log("completed");
                    return resolve();
                })
                .catch(err => {
                    console.log("completed");
                    return reject(err);
                });
        });
    }

    static getUsersClaims = (uid) => {
        // its a promise so return
        // return new Promise((resolve, reject) => {
        return (Util.apiGet(`/api/auth/getClaims/${uid}`));
        // })
    }

    // Everything from top down must be async or awaits do NOT wait
    static getUsers = () => {

        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            db.collection("users").get().then((querySnapshot) => {
                let users = [];
                querySnapshot.forEach(doc => {
                    let user = {};
                    user = doc.data();
                    user.id = doc.id;

                    users.push(user);
                });
                // console.log(users);
                return (resolve(users));
            }).catch(err => {
                reject(err);
            });
        });
    }

    // get user base on uid (id and uid are same)
    static get = (uid) => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let docRef = db.collection("users").doc(uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    // update
                    let user = doc.data();
                    return(resolve(user));
                }
                console.log("User not found in firestore");
                return(resolve());
            }).catch(err => {
                reject(`Error getting user in UserAPI.get ${err}`);
            });
        });
    }

    // complete later
    static delete = (uid) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            Util.apiPost(`/api/auth/deleteUser/${uid}`, {
                    id: uid
                }).then(() => {
                    console.log("Auth for User successfully deleted!");
                    db.collection("users").doc(uid).delete().then(() => {
                        console.log("Firestore User successfully deleted!");
                        return resolve();
                    }).catch((err) => {
                        console.error("Error deleting firestor user ", err);
                        return reject(err);
                    });
                }).catch((err) => {
                    console.error("Error deleting auth user ", err);
                    return reject(err);
                });

        });
    }

    static update =  (user) => {
        console.log(`trying to update user in fb and auth: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();
            const authUser = await Util.getCurrentAuthUser();

            authUser.updateProfile({
                displayName: user.displayName,
                photoURL: user.photoURL,
            })
            .then(() => {
                console.log("Auth for User successfully updated!");
                // update
                console.log("User updated, user=", user);
                db.collection('users').doc(user.uid).set({
                    displayName: user.displayName,
                    phoneNumber: user.phoneNumber,
                    uid: user.uid,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : ""
                },{ merge: true }).then(() => {
                    console.log("completed");
                    resolve();
                }).catch(err => {
                    console.error(`error updating user: ${err}`);
                    reject(err);
                });
            })
            .catch(err => {
                console.log("completed");
                reject(err);
            });
        });
    }


    // returns a promise 
    static makeAdmin = (uid) => {
        return (Util.apiPost(`/api/auth/setAdmin/${uid}`, {
            id: uid
        }));
    }
    // returns a promise 
    static makeCashier = (uid) => {
        return (Util.apiPost(`/api/auth/setCashier/${uid}`, {
            id: uid
        }));
    }
}

export default UserAPI;