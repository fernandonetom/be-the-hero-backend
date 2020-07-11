const { storage, bucket } = require("./googleStorage");
var getRawBody = require("raw-body");
var Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

const incidentUploadVerify = (req, res, next) => {
	if (
		req.rawBody === undefined &&
		req.method === "POST" &&
		req.headers["content-type"].startsWith("multipart/form-data")
	) {
		getRawBody(
			req,
			{
				length: req.headers["content-length"],
				limit: "10mb",
			},
			function (err, string) {
				if (err) return next(err);
				req.rawBody = string;
				next();
			}
		);
	} else {
		next();
	}
};

const incidentUploadStarter = (req, res, next) => {
	if (
		req.method === "POST" &&
		req.headers["content-type"].startsWith("multipart/form-data")
	) {
		const busboy = new Busboy({ headers: req.headers });
		req.files = {
			file: [],
		};

		busboy.on("field", (fieldname, value) => {
			req.body[fieldname] = value;
		});

		let imageToBeUploaded = {};

		busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
			const extension = filename.split(".").pop();
			console.log(extension);

			const allowedExtensions = ["png", "jpg", "gif", "jpeg"];

			if (allowedExtensions.includes(extension)) {
				const imageFileName = `incident-${Date.now()}-${filename}`;
				const filePath = path.join(os.tmpdir(), imageFileName);
				imageToBeUploaded = {
					filePath,
					mimetype,
					imageFileName,
				};

				file.pipe(fs.createWriteStream(filePath));
			} else {
				return res.json({ error: "Formato inválido" });
			}
		});

		busboy.on("finish", () => {
			bucket
				.upload(imageToBeUploaded.filePath, {
					gzip: true,
					resumable: false,
					metadata: {
						cacheControl: "public, max-age=31536000",
						metadata: {
							contentType: imageToBeUploaded.mimetype,
						},
					},
				})
				.then(() => {
					const imageUrl = `https://firebasestorage.googleapis.com/v0/b/apoie-uma-ong.appspot.com/o/${imageToBeUploaded.imageFileName}?alt=media`;
					req.body.imageUrl = imageUrl;
					req.body.imageName = imageToBeUploaded.imageFileName;
					console.log(req.body.imageName);
					next();
				})
				.catch((err) => {
					console.log(err);
					res.send("Erro ao fazer upload");
				});
		});

		busboy.end(req.rawBody);
		req.pipe(busboy);
	} else {
		next();
	}
};

module.exports = { incidentUploadVerify, incidentUploadStarter };
