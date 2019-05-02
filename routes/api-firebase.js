const admin = require("../middleware/authServerCommon");
const db = admin.firestore();;

let deposits = [];
let depositsArchive = [];
let cash = [];
let credit = [];

// Get all deposits on load
db.collection("deposits").onSnapshot((querySnapshot) => {
    deposits = [];
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        deposits.push(deposit);
    });
}, (err) => console.log(err));

// Get all archived deposits on load
db.collection("depositsarchive").onSnapshot((querySnapshot) => {
    depositsArchive = [];
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        depositsArchive.push(deposit);
    });
}, (err) => console.log(err));

// Get balances over time
db.collection("cash").onSnapshot(querySnapshot => {
    cash = [];
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        cash.push(total);
    });
}, (err) => console.log(err));

// Get credit over time
db.collection("credit").onSnapshot(querySnapshot => {
    credit = [];
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        credit.push(total);
    });
}, (err) => console.log(err));


// Routes Below ------------------------------------------------------------------------------------------
module.exports = function (app) {
    // Send all deposits
    app.get("/api/firestore/deposits", (req, res) => {
        res.json(deposits);
    });

    // Send all archived deposits
    app.get("/api/firestore/depositsArchive", (req, res) => {
        res.json(depositsArchive);
    });

    // Send all cash
    app.get("/api/firestore/cash", (req, res) => {
        res.json(cash);
    });

    // Send all credit
    app.get("/api/firestore/credit", (req, res) => {
        res.json(credit);
    });

    // Get pending deposit total - ie not in safe, but not settled
    app.get("/api/firestore/getPendingTotal", (req, res) => {
        let result = new Promise((resolve, reject) => {
            let total = 0;
            let pendingTrans = depositsArchive.filter(dep => dep.awaitingSettlement === true);
            pendingTrans.forEach(tran => total += tran.amount);
            resolve(total);
        });
        result.then(result => res.json(result));
    });

    // Get settled deposit total - transactions that have been settled 
    app.get("/api/firestore/getSettledTotal", (req, res) => {
        let result = new Promise((resolve, reject) => {
            let total = 0;
            let pendingTrans = depositsArchive.filter(dep => dep.awaitingSettlement === false);
            pendingTrans.forEach(tran => total += tran.amount);
            resolve(total);
        });
        result.then(result => res.json(result));
    });

};

