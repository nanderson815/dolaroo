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

    // Get cash in safe
    static getInSafeTotal = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let total = 0;
            let docRef = db.collection("deposits");
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    total += doc.data().amount;
                });
                resolve(total);
            }).catch(err => {
                reject(`Error getting deposits in getInSafeTotal ${err.message}`);
            });
        });
    }



    // Gets deposits that are not in safe, but havent been settled. 
    static getPendingTotal = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let total = 0;
            let docRef = db.collection("depositsarchive").where("awaitingSettlement", "==", false);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    total += doc.data().amount;
                });
                resolve(total);
            }).catch(err => {
                reject(`Error getting depositsArchive in getAwaitingTotal ${err.message}`);
            });
        });
    }

}

export default DepositDB;