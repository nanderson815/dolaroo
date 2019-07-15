var admin = require('firebase-admin');



module.exports = function (app) {

    app.post("/setFirstUser/setCustomClaims/:uid/:pass", (req, res) => {
        let uid = req.params.uid
        let password = req.params.pass

        // check if user has submitted a password as request param. 
        if (password === "testPassword") {
            let firstUserClaims = {
                testCompany: true,
                isAdmin: true,
                isCashier: false,
                isUser: false
            }
            admin.auth.setCustomUserClaims(uid, firstUserClaims).then(() => {
                res.json(uid)
            })

            res.json(firstUserClaims);
        }
    });
}