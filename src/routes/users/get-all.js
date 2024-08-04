const { knex } = require("../../connectors/postgres");
/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.get("/users", async (req, res) => {
        const users = await knex.queryBuilder().select("id", "name").from("users");
        res.json(users);
    });
};
