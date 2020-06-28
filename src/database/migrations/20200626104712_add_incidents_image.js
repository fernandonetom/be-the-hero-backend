exports.up = function (knex) {
	return knex.schema.table("incidents", function (table) {
		table.string("image");
	});
};

exports.down = function (knex) {
	return knex.schema.table("incidents", function (table) {
		table.dropColumn("image");
	});
};
