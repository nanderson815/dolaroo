const admin = require("../middleware/authServerCommon");
const db = admin.firestore();;



module.exports = function (app) {
    app.get("/api/firestore/deposits", (req, res) => {
        console.log("hit");
        db.collection("deposits").get().then((querySnapshot) => {
            let deposits = [];
            querySnapshot.forEach((doc) => {
                querySnapshot.forEach(doc => {
                    let deposit = {};
                    deposit = doc.data();
                    deposit.id = doc.id;
                    deposits.push(deposit);
                });
                return (deposits);
            });
            res.json(deposits);
        });
    });
};

