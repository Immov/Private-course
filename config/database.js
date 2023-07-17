require("dotenv").config();

const dbConfig = {
	host: process.env.SQL_HOST,
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: process.env.SQL_DATABASE,
};

module.exports = dbConfig;
