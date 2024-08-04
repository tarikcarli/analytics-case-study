const knex = require("knex")({
    client: "pg",
    searchPath: ["public"],
    connection: {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
    },
});

module.exports = {
    knex,
};
