const connection = require("../database/connection");
const { existsOrError } = require("./Validation");
module.exports = {
	async create(request, response) {
		const { id } = request.body;

		try {
			existsOrError(id, "ONG não informada");
			const ong = await connection("ongs").where({ id }).select("name").first();

			existsOrError(ong, "ONG não encontrada");
			return response.json(ong);
		} catch (message) {
			return response.status(400).json({ message });
		}
	},
};
