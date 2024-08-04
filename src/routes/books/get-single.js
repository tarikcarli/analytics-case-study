const joi = require("joi");
const HttpError = require("http-errors");
const { knex } = require("../../connectors/postgres");
const { UINT32_MAX_VALUE } = require("../../constants/contant");
const paramSchema = joi.object({
    id: joi.number().integer().required().min(1).max(UINT32_MAX_VALUE),
});

/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.get("/books/:id", async (req, res) => {
        await paramSchema.validateAsync(req.params, { stripUnknown: true });

        const books = await knex
            .queryBuilder()
            .select("id", "name", "score")
            .from("books")
            .where("id", req.params.id);
        const book = books[0];
        if (!book) {
            throw new HttpError.NotFound();
        }

        res.json(book);
    });
};
