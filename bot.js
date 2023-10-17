require("dotenv").config();
require("module-alias/register");

// register extenders
require("@helpers/extenders/Message");
require("@helpers/extenders/Guild");
require("@helpers/extenders/GuildChannel");

const { checkForUpdates } = require("@helpers/BotUtils");
const { initializeMongoose } = require("@src/database/mongoose");
const { BotClient } = require("@src/structures");
const { validateConfiguration } = require("@helpers/Validator");

validateConfiguration();

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");

// find unhandled promise rejections
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));

(async () => {




  // start the client
  await client.login(process.env.BOT_TOKEN);
})();
