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
                        reject(`error in set creating user from authUser: ${err}`);    
                    });
                } else {
                    // cretae if not existing
                    console.log("New user created", authUser);
                    db.collection('users').doc(authUser.user.uid).set({
                        displayName: authUser.user.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email
                    }).then((doc) => {
                        console.log("Document set with ID: ", doc.id);
                        resolve(doc.id);
                    }).catch(err => {
                        console.error(`error creating user from authUser: ${err}`);
                        reject(`error in set creating user from authUser: ${err}`);    
                    });
                }
            }).catch(err => {
                console.error(`error creating user from authUser: ${err}`);
                reject(`error in docRef.get creating user from authUser: ${err}`);
            });
        });
    }

    // this registers new user that was previously created in firestore by admin 
    // that has not been auth yet
    static registerUser = (authUser) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // let user ={};
            let docRef = db.collection("users").where("email", "==", authUser.user.email).limit(1);
            docRef.get().then((querySnapshot) => {
                let user = null;
                querySnapshot.forEach(doc => {
                    user = doc.data();
                    user.id = doc.id;
                });
                if (!user) {
                    // create new user with authUser info only since none exist yet
                    const arrayName = authUser.displayName.split(" ");
                    let firstName="", lastName="";
                    if (arrayName.length > 1) {
                        firstName = arrayName[0];
                        lastName = arrayName[0];
                    }
                    db.collection('users').doc(authUser.user.uid).set({
                        displayName: authUser.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email.toLowerCase(),
                        photoURL: authUser.photoURL ? authUser.photoURL : "",
                        firstName: firstName,
                        lastName: lastName,
                        claims: "user",
                        isAdmin: false,
                        isCashier: false,
                        isUser: true
                    }).then((doc) => {
                        console.log("new user created in fb from authUser");
                        return resolve();
                    }).catch(err => {
                        console.error(`error created user from auhUser with uid:${authUser.user.uid}`);
                        return reject(err);
                    });                   
                } else if (user.id !== authUser.user.uid) {
                    // now create *new* fb doc with key as auth uid
                    db.collection('users').doc(authUser.user.uid).set({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        displayName: authUser.user.displayName,
                        phoneNumber: user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email,
                        claims: "user",
                        isAdmin: false,
                        isCashier: false,
                        isUser: true,
                        photoURL: user.photoURL ? user.photoURL : ""    
                    }).then((doc) => {
                        console.log(`new user created in fb from admin created user with user.id ${user.id}`);
                        // now delete the *old* user records since its no longer valid
                        db.collection("users").doc(user.id).delete().then(() => {
                            console.log("Admin Created Firestore User successfully deleted!");
                            resolve();
                        }).catch((err) => {
                            console.error("Error deleting firestore user ", err);
                            reject(`Error deleting firestore user ${err}`);
                        });
                    }).catch(err => {
                        console.error(`error created user from admin created user with email:${authUser.user.email}`);
                        reject(`Error deleting firestore user ${err}`);
                    });
                } else {
                    // This means the authUser AND FB user doc already both exist, so just update auth info
                    // this should really never heappen so just a backstop in case DB corrupted
                    db.collection('users').doc(authUser.user.uid).set({
                        displayName: authUser.user.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email.toLowerCase()
                    }).then((doc) => {
                        console.log("new user created in fb from authUser");
                        resolve();
                    }).catch(err => {
                        console.error(`error created user from auhUser with uid:${authUser.user.uid}`);
                        reject(`error created user from auhUser with uid:${authUser.user.uid}, er: ${err}`);
                    });
                }
            }).catch(err => {
                console.error(`error getting user from fb with email:${authUser.user.email}`);
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

             // MAYBE out how to update this users auth profile - outside of account

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

    // This update only puts user in FB - NO Auth
    // It is meant to create a user and then they can login/authenticate
    // Later - signup will ensure that user email exsists before allowing them to signup
    static addUserToFireStore =  (user) => {
        console.log(`trying to update user in fb and auth: ${user}`);

        return new Promise(async (resolve, reject) => {
            const db = Util.getFirestoreDB();
            let _uid = "noauth"; // if not valid, make sure it wont find on set and will create
            if (user.uid && user.uid !== undefined) {
                _uid = user.uid;
            }

            const _id = user.id ? user.id !== undefined : null;

            if (user.id && user.id !== undefined) {
                let docRef = db.collection("users").doc(_id);
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        // update
                        db.collection('users').doc(user.id).update({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            displayName: `${user.firstName} ${user.lastName}`,
                            phoneNumber: user.phoneNumber,
                            uid: _uid,
                            email: user.email.toLowerCase(),
                            claims: user.claims ? user.claims : "noauth",
                            isAdmin: user.isAdmin,
                            isCashier: user.isCashier,
                            isUser: user.isUser,                        
                            photoURL: user.photoURL ? user.photoURL : ""    
                        }).then((doc) => {
                            console.log("Document updated with ID: ", doc.id);
                            resolve(doc.id);
                        }).catch(err => {
                            console.error(`error updating user: ${err}`);
                            reject(err);
                        });        
                    } else {
                        // set if not existing
                        db.collection('users').doc(user.id).set({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            displayName: `${user.firstName} ${user.lastName}`,
                            phoneNumber: user.phoneNumber,
                            uid: _uid,
                            email: user.email.toLowerCase(),
                            claims: user.claims ? user.claims : "noauth",
                            isAdmin: user.isAdmin,
                            isCashier: user.isCashier,
                            isUser: user.isUser,                        
                            photoURL: user.photoURL ? user.photoURL : ""    
                        }).then((doc) => {
                            console.log("Document set with ID: ", doc.id);
                            resolve(doc.id);
                        }).catch(err => {
                            console.error(`error set user: ${err}`);
                            reject(err);
                        });        
                    }
                }).catch (err => {
                    console.error(`error updating user (in getRef) with id: ${_id}, error: ${err}`);
                    reject(err);
                });
            } else {
                // add if didnt exist and let fb create the key
                db.collection('users').add({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    displayName: `${user.firstName} ${user.lastName}`,
                    phoneNumber: user.phoneNumber,
                    uid: _uid,
                    email: user.email.toLowerCase(),
                    claims: user.claims ? user.claims : "noauth",
                    isAdmin: user.isAdmin,
                    isCashier: user.isCashier,
                    isUser: user.isUser,                        
                    photoURL: user.photoURL ? user.photoURL : ""    
                }).then((doc) => {
                    console.log("Document created with ID: ", doc.id);
                    resolve(doc.id);
                }).catch(err => {
                    console.error(`error updating user: ${err}`);
                    reject(err);
                });                      
            }
        }); // Promise
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