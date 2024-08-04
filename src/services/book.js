const { knex } = require("../connectors/postgres");
async function isBookBorrowed(bookId) {
    return (
        (
            await knex
                .queryBuilder()
                .from("borrow_books")
                .where("book_id", bookId)
        ).length > 0
    );
}
async function isBookBorrowedByUser(bookId, userId) {
    return (
        (
            await knex
                .queryBuilder()
                .from("borrow_books")
                .where("book_id", bookId)
                .where("user_id", userId)
        ).length > 0
    );
}
module.exports = {
    isBookBorrowed,
    isBookBorrowedByUser,
};
