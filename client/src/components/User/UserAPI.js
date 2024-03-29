import Util from "../Util/Util";

class UserAPI {
    // geths the current auth user info from firestore auth service
    static getCurrentAuthUser = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            resolve(Util.getCurrentAuthUser());
        });
    }

    // get current user info from auth AND firestore
    static getCurrentUser = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            Util.getCurrentAuthUser().then(autUser => {
                const uid = autUser.uid;
                // then get from firestore
                let docRef = db.collectionGroup("users").where("uid", "==", uid);
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

    // Updates the current user (not do NOT update uid since it is really a primary key)
    // uid doc field in firestore should only be messed with on create
    static updateCurrent = (user) => {
        console.log(`trying to update user in fb and auth: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();
            const authUser = await Util.getCurrentAuthUser();

            // we always want uid = id to keep auth and firestore in sync
            authUser.updateProfile({
                displayName: `${user.firstName} ${user.lastName}`,
                photoURL: user.photoURL,
            })
                .then(() => {
                    console.log("Auth Profile for User successfully updated!");
                    // update
                    // Note: DO NOT update claimns since that can only be done by admin
                    let ref = db.collectionGroup("users").where("uid", "==", user.id).get()
                    ref.then(snap => {
                        snap.docs.forEach(doc => {
                            let docPath
                            console.log(doc.ref.path)
                            docPath = doc.ref.path

                            db.doc(docPath).set({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                displayName: `${user.firstName} ${user.lastName}`,
                                phoneNumber: user.phoneNumber,
                                email: user.email.toLowerCase(),
                                photoURL: user.photoURL ? user.photoURL : ""
                            }, { merge: true }).then(() => {
                                console.log("completed");
                                resolve();
                            }).catch(err => {
                                console.error(`error updating user: ${err}`);
                                reject(err);
                            });
                        });
                    });
                })
                .catch(err => {
                    console.log("completed");
                    reject(err);
                });
        });
    }

    // This calls the backend to allow admins to create an auth user securely abd not change login
    static createAuthUser = (authUser) => {
        return (Util.apiPost("/api/auth/createUser", authUser));
    }

    // Adds a user that has been authroized to the firestore collection
    // If userInfo is passed, add all that, otherwise, just add info from authUser 
    static addAuthUserToFirestore = (authUser, company, location) => {
        // get first and last name from authUser display name
        const nameArray = authUser.user.displayName.split(" ");
        let user = {};

        user = {
            displayName: authUser.user.displayName,
            firstName: nameArray.length > 0 ? nameArray[0] : "",
            lastName: nameArray.length > 1 ? nameArray[1] : "",
            phoneNumber: authUser.user.phoneNumber ? authUser.user.phoneNumber : "",
            uid: authUser.user.uid,
            email: authUser.user.email.toLowerCase(),
            photoURL: authUser.user.photoURL ? authUser.user.photoURL : "",
            location: location,
            company: company
        };

        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            let docRef = db.collection(company).doc(location).collection("users").doc(authUser.user.uid);
            docRef.get().then((doc) => {
                if (doc.exists) {
                    // update
                    docRef.update({
                        displayName: user.displayName,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        uid: user.uid,
                        email: user.email,
                        photoURL: user.photoURL,
                        location: user.location,
                        company: user.company
                    }, { merge: true }).then((doc) => {
                        console.log("Document updated with ID: ", doc.id);
                        resolve(doc.id);
                    }).catch(err => {
                        console.error(`Error creating user from authUser: ${err}`);
                        reject(`Error in addAuthUserToFirestore.update creating user from authUser: ${err}`);
                    });
                } else {
                    // cretae if not existing
                    docRef.set({
                        displayName: user.displayName,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        uid: user.uid,
                        email: user.email,
                        photoURL: user.photoURL,
                        location: user.location,
                        company: user.company
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

    static addAuthUserToLocation = (authUser, company, location) => {
        const db = Util.getFirestoreDB();
        let uid = authUser.user.uid;

        db.collection(company).doc(location).update({
            [`roles.${uid}`]: "employee"
        })
    }

    static getUsersClaims = (uid) => {
        // its a promise so return
        return (Util.apiGet(`/api/auth/getClaims/${uid}`));
    }

    // Everything from top down must be async or awaits do NOT wait
    static getUsers = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            db.collectionGroup("users").get().then((querySnapshot) => {
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

    // get user by email
    static getByEmail = (email) => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let user = {};
            let foundUser = false;
            let docRef = db.collectionGroup("users").where("email", "==", email.toLowerCase()).limit(1);
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
            let docRef = db.collectionGroup("users").where("uid","==", id);
            docRef.get().then((snap) => {
                snap.forEach(doc => {
                    if (doc.exists) {
                        console.log(doc.data())
                        // update
                        let user = doc.data();
                        return (resolve(user));
                    }
                    console.log("User not found in firestore");
                    return (resolve());
                })
                
            }).catch(err => {
                reject(`Error getting user in UserAPI.get ${err}`);
            });
        });
    }

    // delete later - MUST be done on server in secure admin/auth environment
    static delete = (uid) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            Util.apiPost(`/api/auth/deleteUser/${uid}`, {
                id: uid
            }).then(() => {
                console.log("Auth for User successfully deleted!");
                // Below needs to be fixed.
                let docRef = db.collectionGroup("users").where("uid", "==", uid);
                docRef.get().then((snap) => {
                    let docPath
                    snap.forEach(doc => {
                        docPath = doc.ref.path
                    })
                    db.doc(docPath).delete().then(()=>{
                        console.log("Firestore User successfully deleted!");
                        return resolve();
                    }).catch((err) => {
                        console.error("Error deleting firestor user ", err);
                        return reject(err);
                    })

                });
            }).catch((err) => {
                console.error("Error deleting auth user ", err);
                return reject(err);
            });

        });
    }

    // Update Existing user
    // NOTE: - I purposely do not update uid since that is essentially the primary key
    static update = (user) => {
        console.log(`trying to update user in firestore: ${user}`);
        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();

            // we always want uid = id to keep auth and firestore in sync
            // Do NOT update isAdmin, isCashier etc.  or claims i- only change claims through auth
            // (unless using just user or noAuth since those are not *secure*)
            db.collectionGroup('users').where("uid", "==", user.id).get()
                .then((snap) => {
                    let docPath = snap.docs[0].ref.path
                    db.doc(docPath).set({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        displayName: `${user.firstName} ${user.lastName}`,
                        phoneNumber: user.phoneNumber,
                        email: user.email.toLowerCase(),
                        photoURL: user.photoURL ? user.photoURL : ""
                    }, { merge: true }).then(() => {
                        resolve();
                    }).catch(err => {
                        console.error(`error updating user: ${err}`);
                        reject(err);
                    });
                })
        });
    }

    // Set company and location
    static setCompanyLocation = (uid, company, location) => {
        return (Util.apiPost(`/api/auth/setLocation/${uid}/${company}/${location}`, {
            id: uid
        }));
    }

    // Make user an Admin user - returns a promise 
    static makeAdmin = (uid) => {
        return (Util.apiPost(`/api/auth/setAdmin/${uid}`, {
            id: uid
        }));
    }

    // Make user a cashier - returns a promise 
    static makeCashier = (uid) => {
        return (Util.apiPost(`/api/auth/setCashier/${uid}`, {
            id: uid
        }));
    }

    // Make user a plain ole user - essential disables admin or cashier or other functionality 
    static makeUser = (uid) => {
        return (Util.apiPost(`/api/auth/setUser/${uid}`, {
            id: uid
        }));
    }

}

export default UserAPI;