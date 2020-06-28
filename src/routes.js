const express = require("express");
const crypto = require("crypto");
const routes = express.Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const multerIncidents = require("./config/multerIncidents");

/* CONTROLLERS */
const OngController = require("./controllers/OngController");
const IncidentController = require("./controllers/IncidentController");
const ProfileController = require("./controllers/ProfileController");
const SessionController = require("./controllers/SessionController");

routes.post("/sessions", SessionController.create);

routes.get("/ongs", OngController.index);
routes.post(
	"/ongs",
	multer(multerConfig).single("image"),
	OngController.create
);

routes.get("/profile", ProfileController.index);

routes.get("/incidents", IncidentController.index);
routes.post(
	"/incidents",
	multer(multerIncidents).single("image"),
	IncidentController.create
);
routes.delete("/incidents/:id", IncidentController.delete);

module.exports = routes;
