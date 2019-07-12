var admin = require('firebase-admin');



module.exports = function (app) {

    app.post("/setFirstUser/setCustomClaims/:uid", (req, res) => {
        let uid = req.params.uid

        admin.auth.setCustomUserClaims(uid, { testCompany: true }).then(() => {
            res.json(uid)
        })

    });

    app.get("/test/test", (req, res) => {
        res.json("hello.")
    });

}