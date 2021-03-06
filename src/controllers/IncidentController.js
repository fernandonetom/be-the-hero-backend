const connection = require("../database/connection");
const validation = require("./Validation");
const { deleteFile } = require("../config/googleStorage");
const fs = require("fs");

const { existsOrError } = require("./Validation");
module.exports = {
	async index(request, response) {
		const { page = 1 } = request.query;
		const incidentsLimit = 6;

		const [count] = await connection("incidents").count();

		const result = await connection("incidents")
			.join("ongs", "ongs.id", "incidents.ong_id")
			.limit(incidentsLimit)
			.offset((page - 1) * incidentsLimit)
			.select([
				"incidents.*",
				"ongs.name",
				"ongs.email",
				"ongs.whatsapp",
				"ongs.city",
				"ongs.uf",
			])
			.orderBy("incidents.id", "desc")
			.catch((error) =>
				response.status(500).json({ error: "Não foi possível listar os casos" })
			);
		try {
			validation.existsOrError(count.count, "Nenhum caso encontrado");
			try {
				existsOrError(result, "Listagem completa");

				response.header("X-Total-Count", count.count);
				response.status(200).json(result);
			} catch (message) {
				response.status(400).json({ message });
			}
		} catch (message) {
			response.status(200).json({ message });
		}
	},
	create(request, response) {
		const { title, description, value } = request.body;
		const ongId = request.headers.authorization;
		const image = request.body.imageName;

		connection("incidents")
			.insert({
				title,
				description,
				value,
				ong_id: ongId,
				image,
			})
			.returning("id")
			.then(([id]) => response.status(200).json({ id }))
			.catch((error) => {
				deleteFile(image);
				response.json({ error: error.message });
			});
	},
	async delete(request, response) {
		const { id } = request.params;
		const ongId = request.headers.authorization;

		const inicident = await connection("incidents")
			.where({ id })
			.select("ong_id", "image")
			.first()
			.catch((error) =>
				response.status(500).json({ error: "Tente novamente mais tarde" })
			);

		try {
			existsOrError(inicident, "Caso não encontrado");

			if (inicident.ong_id !== ongId) {
				return response
					.status(401)
					.json({ error: "Você não tem permissão para deletar o caso" });
			}

			const deleted = await connection("incidents")
				.where({ id })
				.delete()
				.catch((error) =>
					response.status(500).json({ error: "Tente novamente mais tarde" })
				);

			try {
				existsOrError(deleted, "Caso não encontrado");
				try {
					const filename = inicident.image;
					deleteFile(filename);
					return response.json({ message: "Sucesso" });
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
