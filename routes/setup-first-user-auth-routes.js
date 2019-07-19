const admin = require("../middleware/authServerCommon");




module.exports = function (app) {

    app.get("/setFirstUser/setCustomClaims/:uid", (req, res) => {
        uid = req.params.uid

        admin.auth().getUser(uid).then((userRecord) =>{
            res.json(userRecord.customClaims)
        });
       
    });

    app.post("/setFirstUser/setCustomClaims/:uid/:company/:loc/:pass", (req, res) => {
        let uid = req.params.uid
        let company = req.params.company
        let loc = req.params.loc
        let password = req.params.pass

        // check if user has submitted a password as request param. 
        if (password === "testPassword") {
            let firstUserClaims = {
                company: company,
                location: loc,
                admin: true,
                cashier: false,
                user: false,
            }
            admin.auth().setCustomUserClaims(uid, firstUserClaims).then(() => {
                updateClaims(uid, company, loc, firstUserClaims)
                res.json(uid)
            })
            
        }
    });

    function updateClaims(uid, company, location, authClaims) {
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();
            // Init claims for primary since you can be multiple
            let updateFields = { claims: "admin" };

            // Only *set* claims passed
            if (authClaims && authClaims.admin != null) updateFields.isAdmin = authClaims.admin;
            if (authClaims && authClaims.cashier != null) updateFields.isCashier = authClaims.cashier;
            if (authClaims && authClaims.user != null) updateFields.isUser = authClaims.user;
            if (authClaims && authClaims.company != null) updateFields.company = authClaims.company;
            if (authClaims && authClaims.location != null) updateFields.location = authClaims.location;



            // update claims
            db.collection(company).doc(location).collection("users").doc(uid).set(updateFields,
                { merge: true }
            ).then(() => {
                resolve();
            }).catch(err => {
                console.error(`Error updating claims in UserDB: ${err}`);
                reject(err);
            });
        });
    }
}