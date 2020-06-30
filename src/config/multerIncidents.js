const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

module.exports = {
	dest: path.resolve(__dirname, "..", "..", "public", "uploads", "incidents"),
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(
				null,
				path.resolve(__dirname, "..", "..", "public", "uploads", "incidents")
			);
		},
		filename: (req, file, cb) => {
			crypto.randomBytes(4, (err, hash) => {
				if (err) cb(err);
				const ongId = req.headers.authorization;
				const fileName = `${ongId}-${hash.toString("hex")}-${
					file.originalname
				}`;

				cb(null, fileName);
			});
		},
	}),
	limits: {
		fileSize: 2 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		const allowedMimes = ["image/jpeg", "imag/jpg", "image/png", "image/gif"];

		if (allowedMimes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Formato inválido"));
		}
	},
};
