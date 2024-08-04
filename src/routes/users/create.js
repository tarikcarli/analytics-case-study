const joi = require("joi");
const { knex } = require("../../connectors/postgres");

const bodySchema = joi.object({
    name: joi.string().required().min(1).max(256),
});

/** @type {(app:import("express").Application) => void} */
module.exports = (app) => {
    app.post("/users", async (req, res) => {
        await bodySchema.validateAsync(req.body, { stripUnknown: true });
        await knex.queryBuilder().insert(req.body).into("users");
        res.status(201).end();
    });
};
