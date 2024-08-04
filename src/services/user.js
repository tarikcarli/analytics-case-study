const { knex } = require("../connectors/postgres");
async function isUserExist(id) {
    return (await knex.queryBuilder().from("users").where("id", id)).length > 0;
}
module.exports = {
    isUserExist,
};
