const admin = require("../middleware/authServerCommon");
const db = admin.firestore();;

let deposits = [];
let depositsArchive = [];
let cash = [];
let credit = [];

// Get all deposits on load
db.collection("deposits").onSnapshot((querySnapshot) => {
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        deposits.push(deposit);
    });
});

// Get all archived deposits on load
db.collection("depositsarchive").onSnapshot((querySnapshot) => {
    querySnapshot.forEach(doc => {
        let deposit = {};
        deposit = doc.data();
        deposit.id = doc.id;
        depositsArchive.push(deposit);
    });
});

// Get balances over time
db.collection("cash").onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        cash.push(total);
    });
});

// Get credit over time
db.collection("credit").onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
        let total = {};
        total = doc.data();
        total.id = doc.id;
        credit.push(total);
    });
});

module.exports = function (app) {
    app.get("/api/firestore/deposits", (req, res) => {
        res.json(deposits);
    });

    app.get("/api/firestore/depositsArchive", (req, res) => {
        res.json(depositsArchive);
    });

    app.get("/api/firestore/cash", (req, res) => {
        res.json(cash);
    })
};

