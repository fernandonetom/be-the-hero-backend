// Update with your config settings.
require("dotenv/config");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
module.exports = {
	development: {
		client: "postgresql",
		connection: {
			host: process.env.BD_HOST,
			database: process.env.BD_DATABASE,
			user: process.env.BD_USER,
			password: process.env.BD_PASSWORD,
			ssl: true,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "./src/database/migrations",
			tableName: "knex_migrations",
		},
	},

	production: {
		client: "postgresql",
		connection: process.env.DATABASE,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: "./src/database/migrations",
			tableName: "knex_migrations",
		},
	},
};
