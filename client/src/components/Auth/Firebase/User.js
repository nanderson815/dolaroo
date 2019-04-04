import axios from 'axios';

class User {

    getUsers = () => {
        // need to figure out how to get the token
        let token;  // dummy out so it can compile for noww
        axios.get(`/api/scrape`, { headers: {"FIREBASE_AUTH_TOKEN" : token}})
        .then(res => {
          const articles = [...res.data];
          this.setState({ articles: articles });
        })
        .catch(err => {
            console.error(err); 
        });
    }

    addUserToFirestore = (db, authUser) => {
        return new Promise((resolve, reject) => {
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
}

export default User;