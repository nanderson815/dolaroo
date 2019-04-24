import Util from "../Util/Util";

class DepositsArchiveDB {
    // ------------------------------------------------------------------
    // Deposits: get awaiting settlement
    static getDepositsAwaitingSettlement = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let settledDeposits = [];
            let docRef = db.collection("deposits").where("awatingSettlement", "==", true);
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
    
    // ------------------------------------------------------------------
    // Deposits:  Update (using transaction)
    // Puts the awaitingSettlement flag into deposits table on all docs
    // make it false since if awaiting settlemenmt is false, its current
    static setToCurrentTransaction = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();             

            // Create a reference to all deposits
            let allDepositsRef = db.collection("deposits");
            db.runTransaction((transaction) => {
                return allDepositsRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        transaction.set(doc.ref, {
                            awatingSettlement: false,
                        }, { merge: true });
                    });
                });
            }).then(() => {
                console.log("Transaction successfully committed!");
                resolve("OK");
            }).catch((err) => {
                console.error("Transaction failed: ", err);
                reject(`Error: ${err}`);
            });
        });
    }

    // ------------------------------------------------------------------
    // Deposits:  Update (using batch - same as above but uses batch)
    // Puts the awaitingSettlement flag into deposits table on all docs
    // make it false since if awaiting settlemenmt is false, its current
    static setToCurrentBatch = () => {
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
                console.log("Batch successfully committed!");
            }).catch((err) =>{
                console.error("Batch failed: ", err);
            });
        });
    }

    // ------------------------------------------------------------
    // DepositsArchive : awaiting settlement
    // get all archgived deposits that are awaiting settlement
    static getArchiveAwaitingSettlement = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let settledDeposits = [];
            let docRef = db.collection("depositsarchive").where("awatingSettlement", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    let settledDepoit = doc.data();
                    settledDepoit.id = doc.id;
                    settledDeposits.push(settledDepoit);
                });
            }).catch(err => {
                reject(`Error getting SettledDeposits in getArchiveAwaitingSettlement ${err.message}`);
            });
        });
    }

    // ------------------------------------------------------------
    // Deposits + DepositsArchive : 
    // This is when SAFE is emptied of the cash to take to bank
    // 1.) Copy all current deposits to archived deposits (chamnging awaiting settlement flag to true)
    // 2.) Delete all current deposits
    // Note: Risk, what if someone is makign deposit while this is going on
    // We may accidentally mark/delete deposit that isnt accounted for
    // NOTE: Check the process
    static clearAwaitingSettlement = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            const fromCollection = "deposits";
            const toCollection = "depositsarchive";

            // Create a reference to all deposits
            let fromRef = db.collection(fromCollection).where("awatingSettlement", "==", false);
            db.runTransaction((transaction) => {
                return fromRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        // Save current doc info changing settlement flag
                        const docCopy = doc.data();
                        docCopy.awatingSettlement = true;

                        // get a ref to the new copy in archive - shouldnt exist
                        // but if it does, iyt will just overwrite which is OK
                        let toRef = db.collection(toCollection).doc(doc.id);

                        // "copy" / Create the deposits into archive collection
                        transaction.set(toRef, docCopy, { merge: true });

                        // Now, delete the transaction from deposits collection
                        transaction.delete(doc.ref);
                    });
                });
            }).then(() => {
                console.log("Archive Transaction successfully committed!");
                resolve("OK");
            }).catch((err) => {
                console.error("Error in clearAwaitingSettlement : ", err);
                reject(`Error in clearAwaitingSettlement: ${err}`);
            });

        }); // promise
    }

    // ------------------------------------------------------------
    // Deposits + DepositsArchive : 
    // This is just a utility function to copy archived deposits BACK to
    // the deposits table during testing phase
    static reverseAwaitingSettlement = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            const fromCollection = "depositsarchive";
            const toCollection = "deposits";

            // Create a reference to all deposits
            let fromRef = db.collection(fromCollection).where("awatingSettlement", "==", true);
            db.runTransaction((transaction) => {
                return fromRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        // Save current doc info changing settlement flag
                        const docCopy = doc.data();
                        docCopy.awatingSettlement = false;

                        // get a ref to the new copy in archive - shouldnt exist
                        // but if it does, iyt will just overwrite which is OK
                        let toRef = db.collection(toCollection).doc(doc.id);

                        // "copy" / Create the deposits into archive collection
                        transaction.set(toRef, docCopy, { merge: true });

                        // Now, delete the transaction from deposits collection
                        transaction.delete(doc.ref);
                    });
                });
            }).then(() => {
                console.log("Reverse Archive Transaction successfully committed!");
                resolve("OK");
            }).catch((err) => {
                console.error("Error in clearAwaitingSettlement : ", err);
                reject(`Error in clearAwaitingSettlement: ${err}`);
            });

        }); // promise
    }

}
export default DepositsArchiveDB;