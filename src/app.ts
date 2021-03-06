import "dotenv/config";
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use(router);

const port = config.get("port");

connectToDb();

app.listen(port, () => {
  log.info(`App started ast http://localhost:${port}`);
});
