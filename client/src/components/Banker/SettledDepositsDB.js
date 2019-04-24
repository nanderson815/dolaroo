import Util from "../Util/Util";

class SettledDepositsDB {
    static getDepositsAwaitingSettlement = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let settledDeposits = [];
            let docRef = db.collection("depoits").where("awatingSettlement", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    let settledDepoit = doc.data();
                    settledDepoit.id = doc.id;
                    settledDeposits.push(settledDepoit);
                });
            }).catch(err => {
                reject(`Error getting deposits in getDepositsAwaitingSettlement ${err.message}`);
            });
        });
    }
    
    // This just puts the awaitingSettlement flag into deposits table on all docs
    static setDepositsToCurrent = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // Create a reference to all deposits
            let batch = db.batch();
            let allDepositsRef = db.collection("deposits");
            allDepositsRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    batch.set(doc.ref, {
                        awatingSettlement: false,
                    }, { merge: true });
                });
                return batch.commit();
            }).then(() => {
                console.log("Transaction successfully committed!");
            }).catch((err) =>{
                console.error("Transaction failed: ", err);
            });
        });
    }

    static getSettledDepositsAwaitingSettlement = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let settledDeposits = [];
            let docRef = db.collection("settleddepoits").where("awatingSettlement", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    let settledDepoit = doc.data();
                    settledDepoit.id = doc.id;
                    settledDeposits.push(settledDepoit);
                });
            }).catch(err => {
                reject(`Error getting SettledDeposits in getSettledDepositsAwaitingSettlement ${err.message}`);
            });
        });
    }

    // Get a new write batch
    static clearAwaitingSettlement = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // First, get all deposits awating settlement
            this.getDepositsAwaitingSettlement.then(deposits => {
                let batch = db.batch();

                // Set all awaiting settlements to clear (i.e awaing settlement = false)
                let waitingRef = db.collection("settleddepoits").where("awatingSettlement", "==", true);
                batch.set(waitingRef, {awatingSettlement: false});
            
                // Delete everything from the deposits table that is awaiting settlement
                let depostisWaitingRef = db.collection("deposits").where("awatingSettlement", "==", true);
                batch.delete(depostisWaitingRef);
    
                // Commit the batch
                batch.commit().then(() => {
                });    

            }).catch(err => {
                reject(`Error getting SettledDeposits in getSettledDepositsAwaitingSettlement ${err.message}`);
            });

        });
    }

    // return db.runTransaction(function(transaction) {
    //     // This code may get re-run multiple times if there are conflicts.
    //     return transaction.get(sfDocRef).then(function(sfDoc) {
    //         if (!sfDoc.exists) {
    //             throw "Document does not exist!";
    //         }
    
    //         var newPopulation = sfDoc.data().population + 1;
    //         transaction.update(sfDocRef, { population: newPopulation });
    //     });
    // }).then(function() {
    //     console.log("Transaction successfully committed!");
    // }).catch(function(error) {
    //     console.log("Transaction failed: ", error);
    // });
}
export default SettledDepositsDB;