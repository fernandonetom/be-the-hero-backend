const crypto = require("crypto");
const connection = require("../database/connection");

const { existsOrError } = require("./Validation");

module.exports = {
	async index(request, response) {
		const ongs = await connection("ongs").select("*");
		try {
			existsOrError(ongs, "Nenhuma ONG cadastrada");
			response.json(ongs);
		} catch (message) {
			response.status(404).json(message);
		}
	},
	async create(request, response) {
		console.log(request.file);
		const { name, email, whatsapp, city, uf } = request.body;
		const id = crypto.randomBytes(4).toString("HEX");

		const image = request.file.filename;
		connection("ongs")
			.insert({
				id,
				name,
				email,
				whatsapp,
				city,
				uf,
				image,
			})
			.then(() => response.json({ id }))
			.catch((error) => response.json({ error: error.message }));
	},
};
