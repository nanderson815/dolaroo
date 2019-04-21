import Util from "../Util/Util";

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
    
    // This calls the backend to allow admins to create an auth user securely abd not change login
    static createAuthUser = (authUser) => {
        return(Util.apiPost("/api/auth/createUser", authUser));
    }

    // Adds a user that has been authroized to the firestore collection
    static addAuthUserToFirestore = (authUser) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            let docRef = db.collection("users").doc(authUser.user.uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    // update
                    console.log("User updated, authUser=", authUser);
                    db.collection('users').doc(authUser.user.uid).update({
                        email: authUser.user.email
                    }).then((doc) => {
                        console.log("Document updated with ID: ", doc.id);
                        resolve(doc.id);
                    }).catch(err => {
                        console.error(`error creating user from authUser: ${err}`);
                        reject(`Error in addAuthUserToFirestore.update creating user from authUser: ${err}`);    
                    });
                } else {
                    // cretae if not existing
                    console.log("New user created", authUser);
                    db.collection('users').doc(authUser.user.uid).set({
                        displayName: authUser.user.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email
                    }).then(() => {
                        console.log("Document added with ID: ", authUser.user.uid);
                        resolve(authUser.user.uid);
                    }).catch(err => {
                        console.error(`error creating user from authUser: ${err}`);
                        reject(`error in addAuthUserToFirestore.add creating user from authUser: ${err}`);    
                    });
                }
            }).catch(err => {
                console.error(`error creating user from authUser: ${err}`);
                reject(`error in addAuthUserToFirestore.docRef.get creating user from authUser: ${err}`);
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
    // TO DO: - 
    static getByEmail = (email) => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            // let user = {};
            let user = {};
            let foundUser = false;
            let docRef = db.collection("users").where("email", "==", email).limit(1);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    foundUser = true;
                    console.log(doc.data());
                    user = doc.data();
                    user.id = doc.id;
                });

                if (foundUser) {
                    console.log(`User with email: ${email} found!, displayName: ${user.displayName}`);
                    resolve(user);
                } else {
                    user.err = `User with email: ${email} not found in firestore`;
                    console.log(user.err);
                    resolve(user);
                }
            }).catch(err => {
                reject(`Error getting user in UserAPI.getByEmail ${err.message}`);
            });
        });
    }

        // get user base on uid (id and uid are same)
    static get = (id) => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let docRef = db.collection("users").doc(id);
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

    static updateCurrent =  (user) => {
        console.log(`trying to update user in fb and auth: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();
            const authUser = await Util.getCurrentAuthUser();
            let _uid = "noauth";
            if (user.uid && user.uid !== undefined) {
                _uid = user.uid;
             }

            // we always want uid = id to keep auth and firestore in sync
            authUser.updateProfile({
                displayName: `${user.firstName} ${user.lastName}`,
                photoURL: user.photoURL,
            })
            .then(() => {
                console.log("Auth Profile for User successfully updated!");
                // update
                // Note: DO NOT update claimns since that can only be done by admin
                db.collection('users').doc(user.id).set({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: `${user.firstName} ${user.lastName}`,
                    phoneNumber: user.phoneNumber,
                    uid: _uid,
                    email: user.email.toLowerCase(),
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

    static update =  (user) => {
        console.log(`trying to update user in firestore: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();
            let _uid = "noauth";
            if (user.uid && user.uid !== undefined) {
                _uid = user.uid;
             }

            // we always want uid = id to keep auth and firestore in sync
            // Do NOT update isAdmin, isCashier etc.  or claims i- only change claims through auth
            // (unless using just user or noAuth since those are not *secure*)
            db.collection('users').doc(user.id).set({
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: `${user.firstName} ${user.lastName}`,
                phoneNumber: user.phoneNumber,
                uid: _uid,
                email: user.email.toLowerCase(),
                photoURL: user.photoURL ? user.photoURL : ""    
            },{ merge: true }).then(() => {
                console.log("completed");
                resolve();
            }).catch(err => {
                console.error(`error updating user: ${err}`);
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