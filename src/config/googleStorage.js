require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
	projectId: JSON.parse(process.env.GCLOUD_KEYS).project_id,
	credentials: JSON.parse(process.env.GCLOUD_KEYS),
});
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL);

const deleteFile = (filename) => {
	bucket
		.file(filename)
		.delete()
		.then(() => {
			return true;
		})
		.catch(() => {
			return false;
		});
};

module.exports = {
	storage,
	bucket,
	deleteFile,
};
