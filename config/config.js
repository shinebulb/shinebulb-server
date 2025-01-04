require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
        database: process.env.DEV_DATABASE,
        host: process.env.DEV_HOST,
        dialect: "mysql"
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: process.env.PRODUCTION_USERNAME,
        password: process.env.PRODUCTION_PASSWORD,
        database: process.env.PRODUCTION_DATABASE,
        host: process.env.PRODUCTION_HOST,
        dialect: "mysql"
    }
}