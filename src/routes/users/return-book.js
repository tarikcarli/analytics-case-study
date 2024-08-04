const joi = require("joi");
const httpError = require("http-errors");
const { knex } = require("../../connectors/postgres");
const { UINT32_MAX_VALUE } = require("../../constants/contant");
const { isBookBorrowedByUser } = require("../../services/book");
const { isUserExist } = require("../../services/user");
const paramSchema = joi.object({
    user_id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
    book_id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
});
const bodySchema = joi.object({
    score: joi.number().integer().required().min(1).max(10),
});
/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.post("/users/:user_id/return/:book_id", async (req, res) => {
        await paramSchema.validateAsync(req.params);
        await bodySchema.validateAsync(req.body);
        if (!(await isUserExist(req.params.user_id))) {
            throw new httpError.BadRequest(
                `User with id:${req.params.user_id} does not exist.`
            );
        }
        if (
            !(await isBookBorrowedByUser(
                req.params.book_id,
                req.params.user_id
            ))
        ) {
            throw new httpError.BadRequest(
                `Book with id:${req.params.book_id} does not borrowed by user with id:${req.params.user_id}`
            );
        }
        await Promise.all([
            knex
                .queryBuilder()
                .insert({ ...req.params, ...req.body })
                .into("borrow_books_history"),
            knex
                .queryBuilder()
                .delete()
                .from("borrow_books")
                .where("book_id", req.params.book_id),
        ]);
        await knex("books")
            .update({
                score: knex("borrow_books_history")
                    .select(knex.raw("avg(score)"))
                    .where("book_id", req.params.book_id),
            })
            .where("id", req.params.book_id);
        res.status(204).end();
    });
};
