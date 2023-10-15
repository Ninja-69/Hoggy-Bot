require("dotenv").config();
const NinjaClient = require("./hogy");
const config = require("./config.json");
const logger = require("./src/utils/logger");
const hogy = new NinjaClient(config);

const color = require("./src/data/colors");
hogy.color = color;

const emoji = require("./src/data/emoji");
hogy.emoji = emoji;

let client = hogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);

hogy.react = new Map();
hogy.fetchforguild = new Map();

hogy.start(process.env.TOKEN);

process.on("unhandledRejection", (reason, p) => {
  logger.info(`[unhandledRejection] ${reason.message}`, { label: "ERROR" });
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  logger.info(`[uncaughtException] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  logger.info(`[uncaughtExceptionMonitor] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  logger.info(`[multipleResolves] MULTIPLE RESOLVES`, { label: "ERROR" });
  console.log(type, promise, reason);
});


