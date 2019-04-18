import Util from "../../Util/Util";

class DepositDB {

    // Get all deposits from firestore 
    static get =  (collection) => {
        return new Promise( (resolve, reject) => {
            const db = Util.getFirestoreDB();   // active firestore db ref

            db.collection(collection).get().then((querySnapshot) => {
                let deposits = [];
                querySnapshot.forEach (doc => {
                    let deposit = {};
                    deposit = doc.data();
                    deposit.id = doc.id;
                    deposits.push(deposit); 
                });
                return(resolve(deposits));
            }).catch(err => {
                reject(err);
            });
        });
    }

    // Get all deposits from firestore BY DATE
    // Join user
    static getByDate =  (collection) => {

        return new Promise( (resolve, reject) => {
            const db = Util.getFirestoreDB();   // active firestore db ref

            let deposits = [];
            db.collection("deposits").orderBy("time", "desc").get().then((querySnapshot) => {
                querySnapshot.forEach (doc => {
                    let deposit = {};
                    deposit = doc.data();
                    deposit.id = doc.id;
                    // default user is the denormalized email on the deposit table
                    deposit.displayName = doc.data().user;
                    // this does not work since resolve gets called beforee inside async finishes
                    // once again, doing async inside loop is no good
                    // const uid = doc.data().uid;
                    // let docRef = db.collection("users").doc(uid);
                    // docRef.get().then((docUser) => {
                    //     if (docUser.exists) {
                    //         deposit.displayName = docUser.data().displayName;
                    //     }
                    //     deposits.push(deposit); 
                    // }).catch (err => {
                    //     // push even if uid not found
                    //     deposits.push(deposit); 
                    // });
                    deposits.push(deposit); 
                });
                return(resolve(deposits));
            }).catch(err => {
                reject(err);
            });
        });
    }

    // Delete a single deposit based on id
    static delete = (id) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();   // active firestore db ref

            db.collection("deposits").doc(id).delete().then(() => {
                console.log("Firestore deposit successfully deleted");
                return resolve();
            }).catch((err) => {
                console.error("Error deleting firestor deposit ", err);
                return reject(err);
            });
        });
    }

}

export default DepositDB;