const joi = require("joi");
const httpError = require("http-errors");
const { knex } = require("../../connectors/postgres");
const { UINT32_MAX_VALUE } = require("../../constants/contant");
const paramSchema = joi.object({
    id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
});

/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.get("/users/:id", async (req, res) => {
        await paramSchema.validateAsync(req.params, { stripUnknown: true });

        let [users, past, present] = await Promise.all([
            knex
                .queryBuilder()
                .select("id", "name")
                .from("users")
                .where("id", req.params.id),
            knex
                .queryBuilder()
                .select("name", "borrow_books_history.score as userScore")
                .from("borrow_books_history")
                .leftJoin("books", "books.id", "borrow_books_history.book_id")
                .where("user_id", req.params.id),
            knex
                .queryBuilder()
                .select("name")
                .from("borrow_books")
                .leftJoin("books", "books.id", "borrow_books.book_id")
                .where("user_id", req.params.id),
        ]);
        const user = users[0];
        if (!user) {
            throw new httpError.NotFound();
        }
        user.book = {
            past,
            present,
        };
        res.json(user);
    });
};
