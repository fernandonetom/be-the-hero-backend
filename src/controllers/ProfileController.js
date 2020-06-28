const { index } = require("./OngController");

const connection = require("../database/connection");
const { existsOrError } = require("./Validation");
module.exports = {
	async index(request, response) {
		const ongId = request.headers.authorization;
		try {
			existsOrError(ongId, "ONG não informada");

			const incidents = await connection("incidents")
				.where({ ong_id: ongId })
				.select("*");

			try {
				existsOrError(incidents, "Nenhuma ONG encontrada");
				return response.json(incidents);
			} catch (message) {
				return response.status(404).json({ message });
			}
		} catch (message) {
			return response.status(400).json({ message });
		}
	},
};
