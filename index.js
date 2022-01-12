"use strict";
exports.__esModule = true;
var database_1 = require("./src/config/database");
var userTable = "CREATE TABLE IF NOT EXISTS\n  users(\n    uid VARCHAR(36) PRIMARY KEY,\n    email VARCHAR(100) NOT NULL,\n    password VARCHAR(100) NOT NULL,\n    nickname VARCHAR(100) NOT NULL\n  )";
var tagTable = "CREATE TABLE IF NOT EXISTS\n  tag(\n    id SERIAL,\n    creator VARCHAR(36) NOT NULL references users(uid),\n    name VARCHAR(40)  NOT NULL,\n    sortOrder INTEGER default 0)";
var defaultSort = "ALTER TABLE \"tag\" ALTER COLUMN \"sortorder\" DROP DEFAULT";
// const dropTable = () => {
//   const schoolTable = 'DROP TABLE user';
//   pool.query(userTable).catch((error) => {
//     throw new Error(error);
//   });
// };
database_1.pool.query(userTable)["catch"](function (error) {
    throw new Error(error);
});
database_1.pool.query(tagTable)["catch"](function (error) {
    throw new Error(error);
});
database_1.pool.query(defaultSort)["catch"](function (error) {
    throw new Error(error);
});
