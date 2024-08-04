const joi = require("joi");
const httpError = require("http-errors");
const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json());

require("./routes/users/get-all")(app);
require("./routes/users/get-single")(app);
require("./routes/users/create")(app);
require("./routes/books/get-all")(app);
require("./routes/books/get-single")(app);
require("./routes/books/create")(app);
require("./routes/users/borrow-book")(app);
require("./routes/users/return-book")(app);

app.use((req, res, next) => {
    if (res.headersSent) {
        res.status(404).end();
    }
});

app.use((err, req, res, next) => {
    let status = 500;
    let message = "Internal Server Error";
    let code = "InternalServerError";
    if (err instanceof httpError.HttpError) {
        status = err.status;
        message = err.message;
        code = err.name;
    } else if (err instanceof joi.ValidationError) {
        status = 400;
        message = err.message;
        code = err.name;
    }
    if (!res.headersSent) {
        res.status(status).json({
            message,
            code,
        });
    }
});

module.exports = {
    app,
};
