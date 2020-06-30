const crypto = require("crypto");
const connection = require("../database/connection");
const fs = require("fs");

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
			.catch((error) => {
				const path = "./public/uploads/ongs/" + image;
				try {
					fs.unlinkSync(path);
					response.json({ error: error.message });
				} catch (error) {
					response.json({ error: error.message }); //Não deletou a imagm
				}
			});
	},
	async delete(request, response) {
		const { id } = request.params;
		try {
			existsOrError(id, "ID não informado");

			const ongData = await connection("ongs")
				.where({ id })
				.select("image")
				.first()
				.catch((error) =>
					response.status(500).json({ error: "Tente novamente mais tarde" })
				);

			const deleted = await connection("ongs")
				.where({ id })
				.delete()
				.catch((error) =>
					response.status(500).json({ error: "Tente novamente mais tarde" })
				);

			try {
				existsOrError(deleted, "ONG não encontrada");
				try {
					const path = "./public/uploads/ongs/" + ongData.image;
					try {
						fs.unlinkSync(path);
						return response.json({ message: "Sucesso" });
					} catch (error) {
						return response.json({ message: "Sucesso" }); //Não deletou a imagm
					}
				} catch (error) {
					response.status(500).json({ error: "Tente novamente mais tarde" });
				}
			} catch (message) {
				return response.status(400).json({ message });
			}
		} catch (message) {
			return response.status(400).json({ message });
		}
	},
};
