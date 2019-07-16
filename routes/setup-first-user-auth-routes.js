var admin = require('firebase-admin');



module.exports = function (app) {

    app.post("/setFirstUser/setCustomClaims/:uid/:loc/:pass", (req, res) => {
        let uid = req.params.uid
        let loc = req.params.loc
        let password = req.params.pass

        // check if user has submitted a password as request param. 
        if (password === "testPassword") {
            let firstUserClaims = {
                testCompany: true,
                [loc]: true,
                isAdmin: true,
                isCashier: false,
                isUser: false
            }
            // admin.auth.setCustomUserClaims(uid, firstUserClaims).then(() => {
            //     res.json(uid)
            // })

            res.json(firstUserClaims);
        }
    });
}