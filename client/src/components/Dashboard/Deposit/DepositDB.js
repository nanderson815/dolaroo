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
    static getByDate =  () => {
        return new Promise( (resolve, reject) => {
            const db = Util.getFirestoreDB();   // active firestore db ref

            db.collection("deposits").orderBy("time", "desc").get().then((querySnapshot) => {
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