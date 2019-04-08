import Util from "../Util/Util"

class UserAPI {

    static getCurrentUser = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            resolve(Util.getCurrentAuthUser());
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
                        username: authUser.user.displayName,
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

    static getUsersClaims =  (uid) => {
        // its a promise so return
        // return new Promise((resolve, reject) => {
            return(Util.apiGet(`/api/auth/getClaims/${uid}`));
        // })
    }

    // Everything from top down must be async or awaits do NOT wait
    static getUsers =  () => {

        return new Promise( (resolve, reject) => {
            const db = Util.getFirestoreDB();

            db.collection("users").get().then((querySnapshot) => {
                let users = [];
                querySnapshot.forEach (doc => {
                    let user = {};
                    user = doc.data();
                    user.id = doc.id;

                    users.push(user); 
                });
                // console.log(users);
                return(resolve(users));
            }).catch(err => {
                reject(err);
            });
        });
    }

    // complete later
    static delete = (uid) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            Util.apiPost(`/api/auth/deleteUser/${uid}`, { id: uid })
            .then (() => {
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

    // returns a promise 
    static makeAdmin = (uid) => {
        return(Util.apiPost(`/api/auth/setAdmin/${uid}`, { id: uid }));
    }
}

export default UserAPI;