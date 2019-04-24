import Util from "../Util/Util";

class DepositsArchiveDB {
    // ------------------------------------------------------------
    // DepositsArchive : Get ALL
    // get all depositsarchive that are awaiting settlement
    static getAll = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let depositsArchive = [];
            let docRef = db.collection("depositsarchive");
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    let deposit = doc.data();
                    deposit.id = doc.id;
                    deposit.time = deposit.time.toDate();
                    depositsArchive.push(deposit);
                });
                resolve(depositsArchive);
            }).catch(err => {
                reject(`Error getting depositsArchive in getAll ${err.message}`);
            });
        });
    }

    // ------------------------------------------------------------
    // DepositsArchive : get all awaiting settlement
    // get all depositsarchive that are awaiting settlement
    static getAwaitingSettlement = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let depositsArchive = [];
            let docRef = db.collection("depositsarchive").where("awatingSettlement", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    let deposit = doc.data();
                    deposit.id = doc.id;
                    deposit.time = deposit.time.toDate();
                    depositsArchive.push(deposit);
                });
                resolve(depositsArchive);
            }).catch(err => {
                reject(`Error getting depositsArchive in getAwaitingSettlement ${err.message}`);
            });
        });
    }

    // -----------------------------------------------------------------------------------
    // Deposits: get awaiting settlement
    // There really should never be any of these - may use in cleanup type activities
    static helperDepositsAwaiting = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let depositsArchive = [];
            let docRef = db.collection("deposits").where("awatingSettlement", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    let deposit = doc.data();
                    deposit.id = doc.id;
                    deposit.time = deposit.time.toDate();
                    depositsArchive.push(deposit);
                });
                resolve(depositsArchive);
            }).catch(err => {
                reject(`Error getting deposits in helperDepositsAwaiting ${err.message}`);
            });
        });
    }
    
    // ------------------------------------------------------------------
    // Deposits:  Update (using transaction) : : HELPER FUNCTION
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

    // -------------------------------------------------------------------------------------------------
    // Deposits + DepositsArchive : 
    // THIS IS ATOMIC transaction so it all works or nothing does which is what we MUST have
    // This is when SAFE is emptied of the cash to take to bank
    // 1.) Copy all current deposits to depositsarchive
    // 2.) Update the awaitingSettlement flag to true on the doc in archive
    // 3.) Delete all current deposits in depoists collection
    // Note: Risk, what if someone is making deposit while this is going on
    // We may accidentally mark/delete deposit that isnt accounted for
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
                        docCopy.settled = false;

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

    // -------------------------------------------------------------------------------------------------
    // Deposits + DepositsArchive : HELPER FUNCTION
    // THIS IS ATOMIC transaction so it all works or nothing does which is what we MUST have
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
                        docCopy.settled = false;

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