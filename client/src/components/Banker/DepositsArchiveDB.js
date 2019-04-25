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
            let docRef = db.collection("depositsarchive").where("awaitingSettlement", "==", true);
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

    // ------------------------------------------------------------
    // DepositsArchive : get total of all deposits awaiting settlement
    // get total all depositsarchive that are awaiting settlement
    static getAwaitingTotal = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let total = 0;
            let docRef = db.collection("depositsarchive").where("awaitingSettlement", "==", true);
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

    // ------------------------------------------------------------
    // DepositsArchive : get all settled deposits
    // get all depositsarchive that are settled
    static getSettledDeposits = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let depositsArchive = [];
            let docRef = db.collection("depositsarchive").where("settled", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    let deposit = doc.data();
                    deposit.id = doc.id;
                    deposit.time = deposit.time.toDate();
                    depositsArchive.push(deposit);
                });
                resolve(depositsArchive);
            }).catch(err => {
                reject(`Error getting depositsArchive in getSettledDeposits ${err.message}`);
            });
        });
    }

    // ------------------------------------------------------------
    // DepositsArchive : get the total of all settled deposits
    // get all depositsarchive that are settled
    static getSettledTotal = () => {
        // its a promise so return
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            // then get from firestore
            let total = 0;
            let docRef = db.collection("depositsarchive").where("settled", "==", true);
            docRef.get().then((querySnapshot) => {
                querySnapshot.forEach(doc => {
                    total += doc.data().amount;
                });
                resolve(total);
            }).catch(err => {
                reject(`Error getting depositsArchive in getSettledTotal ${err.message}`);
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
            let docRef = db.collection("deposits").where("awaitingSettlement", "==", true);
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
    
    // ------------------------------------------------------------
    // Deposits : get the total of all in the safe
    // get total of deposits in the safe
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
                            awaitingSettlement: false,
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
                        awaitingSettlement: false,
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
    static sendDepositsToBank = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            const fromCollection = "deposits";
            const toCollection = "depositsarchive";

            // Create a reference to all deposits
            let fromRef = db.collection(fromCollection).where("awaitingSettlement", "==", false);
            db.runTransaction((transaction) => {
                return fromRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        // Save current doc info changing settlement flag
                        const docCopy = doc.data();
                        docCopy.awaitingSettlement = true;
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
                console.error("Error in sendDepositsToBank : ", err);
                reject(`Error in sendDepositsToBank: ${err}`);
            });

        }); // promise
    }

    // -------------------------------------------------------------------------------------------------
    // DepositsArchive :  settleDeposits
    // THIS IS ATOMIC transaction so it all works or nothing does which is what we MUST have
    // This is when the money is deposited into the customers bank account via brinks or similar
    // 1.) Just loop through ALL depositsarchive and set settled to true and awaiting settlement to false
    // NOTE:  We should notify someone with badge or something
    // maybe firebase messaging for this
    static settleDeposits = (userInfo) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            const updateCollection = "depositsarchive";

            // Total up the amount settled
            let totalSettled = 0;
            // Create a reference to all deposits
            let updateRef = db.collection(updateCollection).where("awaitingSettlement", "==", true);
            db.runTransaction((transaction) => {
                return updateRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        // grab ref to this document
                        totalSettled += doc.data().amount;
                        transaction.set(doc.ref, {
                            awaitingSettlement: false,
                            settled: true,
                            settledDateTime: new Date(),
                            settledUid: userInfo.uid
                        }, { merge: true });
                    });
                    return(totalSettled);
                });
            }).then((totalSettled) => {
                console.log(`Archive Transaction successfully committed!, totalSettled is: ${totalSettled}`);
                resolve(totalSettled);
            }).catch((err) => {
                console.error("Error in settleDeposits : ", err);
                reject(`Error in settleDeposits: ${err}`);
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
            let fromRef = db.collection(fromCollection).where("awaitingSettlement", "==", true);
            db.runTransaction((transaction) => {
                return fromRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        // Save current doc info changing settlement flag
                        // dont copy ALL fields since depositsArchivce has more 
                        const docCopy = {};
                        docCopy.amount = doc.data().amount;
                        docCopy.email = doc.data().email;
                        docCopy.ones = doc.data().ones;
                        docCopy.fives = doc.data().fives;
                        docCopy.tens = doc.data().tens;
                        docCopy.twenties = doc.data().twenties;
                        docCopy.fifties = doc.data().fifties;
                        docCopy.hundreds = doc.data().hundreds;
                        docCopy.time = doc.data().time;
                        docCopy.uid = doc.data().uid;
                        docCopy.awaitingSettlement = false;
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
                console.error("Error in reverseAwaitingSettlement : ", err);
                reject(`Error in reverseAwaitingSettlement: ${err}`);
            });

        }); // promise
    }

    // get random number between 0 and max-1
    static getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
    

    // -------------------------------------------------------------------------------------------------
    // Deposits + DepositsArchive : HELPER FUNCTION
    // THIS IS ATOMIC transaction so it all works or nothing does which is what we MUST have
    // This is just a utility function to copy archived deposits BACK to
    // the deposits table during testing phase
    static fixDepositTable = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();
            const toCollection = "deposits";

            // Create a reference to all deposits
            let fromRef = db.collection(toCollection);
            db.runTransaction((transaction) => {
                return fromRef.get().then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        const ones = this.getRandomInt(10);
                        const fives = this.getRandomInt(5);
                        const tens = this.getRandomInt(4);
                        const twenties = this.getRandomInt(3);
                        const fifties = this.getRandomInt(3);
                        const hundreds = this.getRandomInt(2);
                        const amount = (ones*1 + fives*5 + tens*10 + twenties*20 + fifties*50 + hundreds*100);
                        let randomDay = this.getRandomInt(15) + 9;
                
                        // Save current doc info changing settlement flag
                        const docCopy = {};
                        docCopy.amount = amount;
                        docCopy.email = "nanderson815@gmail.com";
                        docCopy.ones = ones;
                        docCopy.fives = fives;
                        docCopy.tens = tens;
                        docCopy.twenties = twenties;
                        docCopy.fifties = fifties;
                        docCopy.hundreds = hundreds;
                        docCopy.time = new Date(`04/${randomDay}/2019`);
                        docCopy.uid = "lbQlUhPp51eaXatf8SNHaAdzY2Y2";
                        docCopy.awaitingSettlement = false;
                        docCopy.settled = false;

                        // "copy" / Create the deposits into archive collection
                        transaction.set(doc.ref, docCopy);
                    });
                });
            }).then(() => {
                console.log("Reverse Archive Transaction successfully committed!");
                resolve("OK");
            }).catch((err) => {
                console.error("Error in reverseAwaitingSettlement : ", err);
                reject(`Error in reverseAwaitingSettlement: ${err}`);
            });

        }); // promise
    }

}
export default DepositsArchiveDB;