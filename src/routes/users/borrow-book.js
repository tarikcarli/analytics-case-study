const joi = require("joi");
const httpError = require("http-errors");
const { knex } = require("../../connectors/postgres");
const { UINT32_MAX_VALUE } = require("../../constants/contant");
const { isBookBorrowed } = require("../../services/book");
const { isUserExist } = require("../../services/user");
const paramSchema = joi.object({
    user_id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
    book_id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
});

/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.post("/users/:user_id/borrow/:book_id", async (req, res) => {
        await paramSchema.validateAsync(req.params);
        if (!(await isUserExist(req.params.user_id))) {
            throw new httpError.BadRequest(
                `User with id:${req.params.user_id} does not exist.`
            );
        }
        if (await isBookBorrowed(req.params.book_id)) {
            throw new httpError.BadRequest(
                `Book with id:${req.params.book_id} has already borrowed.`
            );
        }

        await knex.queryBuilder().insert(req.params).into("borrow_books");
        res.status(204).end();
    });
};
