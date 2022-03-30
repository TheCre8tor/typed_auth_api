import "dotenv/config";
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use(deserializeUser);
app.use(router);

const port = config.get("port");

connectToDb();

app.listen(port, () => {
  log.info(`App started ast http://localhost:${port}`);
});
