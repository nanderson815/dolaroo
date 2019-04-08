import Util from "../Util/Util"

class UserAPI {

    static getCurrentUser = () => {
        // its a promise so return
        return(Util.apiGet(`/api/user`));
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

    static getUsersClaims = async (uid) => {
        // its a promise so return
        let res = await (Util.apiGet(`/api/auth/getClaims/${uid}`));
        return res;
    }

    static getUsers = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            db.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach(async doc => {
                    let res = await this.getUsersClaims(doc.id);
                    console.log(`claims: ${JSON.stringify(res.data.customClaims)}`);
                })
                resolve(querySnapshot);
            }).catch(err => {
                reject(err);
            });
        });
    }

    // complete later
    static delete = (uid) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            return resolve();
        });
    }

    // returns a promise 
    static makeAdmin = (uid) => {
        return(Util.apiPost(`/api/auth/setAdmin/${uid}`, { id: uid }));
    }
}

export default UserAPI;