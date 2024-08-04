const { knex } = require("../../connectors/postgres");
/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.get("/books", async (req, res) => {
        const books = await await knex.queryBuilder().select("id", "name").from("books");
        res.json(books);
    });
};
