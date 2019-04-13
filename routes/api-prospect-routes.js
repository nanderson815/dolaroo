const Prospect = require('../models/Prospect');


module.exports = function (app) {

    // Route for posting prospect info to mongo db
    app.route("/api/prospect")
        .post((req, res) => {
            Prospect.create(req.body)
                .then(dbModel => res.json(dbModel))
        });

    app.get("/api/propspect", (req, res) => {
        try {
            res.json({
                uid: "ppppp",
                name: "Paul",
                email: "paul.linck@gmail.com"
            });
        } catch (err) {
            // catch all error
            res.status(500).json(`Error caught in route app.get("/api/user
                 ..." ${err.errors[0].message}`);
        }
    }); // Route
};