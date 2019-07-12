
module.exports = function (app) {

app.post("/setFirstUser/setCustomClaims/:uid", (req, res) => {
    let uid = req.params.uid
    res.json(uid)
});

app.get("/test/test", (req, res) => {
    res.json("hello.")
});

}