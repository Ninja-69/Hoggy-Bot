const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Delete the current channel",
  cooldown: 0,
  category: "ADMIN",
  botPermissions: ["EmbedLinks", "ManageChannels"],
  userPermissions: ["ManageChannels"],

  command: {
    enabled: true,
    aliases: [],
    usage: "[COMMAND]",
    minArgsCount: 0,
  },

  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [],
  },

  async messageRun(message, args, data) {
    const confirmationEmbed = new EmbedBuilder()
      .setTitle("Channel Deletion Confirmation")
      .setDescription(
        "Are you sure you want to delete this channel? This action is irreversible."
      )
      .setColor("#FF0000");

    const confirmationButton = new ButtonBuilder()
      .setCustomId("confirm_nuke")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger);

    const confirmationActionRow = new ActionRowBuilder().addComponents(
      confirmationButton
    );

    const confirmationMessage = await message.safeReply({
      embeds: [confirmationEmbed],
      components: [confirmationActionRow],
    });

    const filter = (interaction) =>
      interaction.customId === "confirm_nuke" &&
      interaction.user.id === message.author.id;

    const collector = confirmationMessage.createMessageComponentCollector({
      filter,
      time: 30000, // Set a timeout of 30 seconds
    });

    collector.on("collect", async (interaction) => {
      await nuke(interaction.channel, message.author);
      await interaction.reply("Channel deleted");
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        message.channel.send("Confirmation time limit reached");
      }
    });
  },

  async interactionRun(interaction, data) {
    const confirmationEmbed = new EmbedBuilder()
      .setTitle("Channel Deletion Confirmation")
      .setDescription(
        "Are you sure you want to delete this channel? This action is irreversible."
      )
      .setColor("#FF0000");

    const confirmationButton = new ButtonBuilder()
      .setCustomId("confirm_nuke")
      .setLabel("Confirm")
      .setStyle(ButtonStyle.Danger);

    const confirmationActionRow = new ActionRowBuilder().addComponents(
      confirmationButton
    );

    await interaction.followUp({
      embeds: [confirmationEmbed],
      components: [confirmationActionRow],
    });

    const filter = (i) =>
      i.customId === "confirm_nuke" &&
      i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 30000, // Set a timeout of 30 seconds
    });

    collector.on("collect", async (i) => {
      await nuke(i.channel, i.user);
      await i.reply("Channel deleted!");
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.followUp("Confirmation time limit reached");
      }
    });
  },
};

async function nuke(channel, executor) {
  const channelName = channel.name;
  const channelPosition = channel.position;

  const author = executor.tag;

  await channel.delete();

  const newChannel = await channel.clone();

  await newChannel.setPosition(channelPosition);

  const confirmationEmbed = new EmbedBuilder()
    .setTitle("**                         Channel Deleted**")
    .setColor("#FF0000")
    .setImage("https://cdn.discordapp.com/attachments/1101189315830222899/1162411196608172062/Media_231013_122640.gif?ex=653bd6c9&is=652961c9&hm=34d6d58a2d7a6370e6acecaf2f4d168b0179afcaeb2190e1031c705fe1730f3f&")
    .setFooter({ text: `Requested by ${executor.tag}`, iconURL: executor.avatarURL() });
  await newChannel.send({ embeds: [confirmationEmbed] });
}
