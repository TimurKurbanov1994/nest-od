"use strict";
exports.__esModule = true;
exports.pool = exports.config = void 0;
var pg_1 = require("pg");
exports.config = {
    host: process.env.DB_HOST,
    type: 'postgress',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true'
};
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test_oq',
    password: '1',
    port: 5432
});
