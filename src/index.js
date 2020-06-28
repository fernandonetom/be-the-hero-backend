const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const { request } = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(routes);

app.listen(process.env.PORT, () => {
	console.log("Executando na porta: " + process.env.PORT);
});
