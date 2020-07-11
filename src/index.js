const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
var getRawBody = require("raw-body");
const {
	ongUploadVerify,
	ongUploadStarter,
} = require("./config/ongImageUpload");
const {
	incidentUploadVerify,
	incidentUploadStarter,
} = require("./config/incidentImageUpload");
const OngController = require("./controllers/OngController");
const IncidentController = require("./controllers/IncidentController");
path = require("path");
const app = express();

var corsOptions = {
	origin: "*",
};
app.use(cors(corsOptions));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.post("/ongs", ongUploadVerify, ongUploadStarter, OngController.create);
app.post(
	"/incidents",
	incidentUploadVerify,
	incidentUploadStarter,
	IncidentController.create
);

app.use(routes);

app.listen(process.env.PORT, () => {
	console.log("Executando na porta: " + process.env.PORT);
});
