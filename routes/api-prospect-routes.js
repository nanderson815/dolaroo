const Prospect = require('../models/Prospect');


module.exports = function (app) {

    // Route for posting prospect info to mongo db
    app.route("/api/prospect")
        .post((req, res) => {
            Prospect.create(req.body)
                .then(dbModel => res.json(dbModel))
        });

};