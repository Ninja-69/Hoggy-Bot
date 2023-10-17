
const { ApplicationCommandOptionType, ChannelType, EmbedBuilder } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */

 module.exports = {
    name: "poll",
    description: "create a poll",
    category: "ADMIN",
    botPermissions: ["ManageMessages"],
    userPermissions: ["ManageGuild"],
        command: {
            enabled: false,
            usage: "<channel> <question> <options>",
            minArgsCount: 3,
            aliases: ["poll"],
          },
    slashCommand: {
        enabled: true,
        ephemeral: true, 
        options: [
            {
                name: "channel", 
                description: "Channel to send the poll in (must be a text channel)",
                type: ApplicationCommandOptionType.Channel, 
                channelTypes: [ChannelType.GuildText, ChannelType.GuildAnnouncement], 
                required: true
            },
            {
                name: "question", 
                description: "Question to ask in the poll", 
                type: ApplicationCommandOptionType.String, 
                required: true
            },
            {
                name: "options", 
                description: "Options to include in the poll (separated by commas)", 
                type: ApplicationCommandOptionType.String, 
                required: true
            },
        ],
    },

   
    
    async interactionRun(interaction) {
        const { options, user, guild } = interaction;

        const channel = options.getChannel("channel");
        const question = options.getString("question");
        const optionsString = options.getString("options");

        const optionsArray = optionsString.split(",");
        const optionsFormatted = optionsArray.map((option, index) => `${index + 1}. ${option}`).join("\n");

        const pollEmbed = new EmbedBuilder()
        .setColor("Random")
        .setThumbnail("https://i.imgur.com/3U0l5ii.jpeg")
        .setTitle("New Poll 📊")
        .setDescription(question)
        .addFields({ name: "Options", value: optionsFormatted })
        .setTimestamp()
        .setFooter({ text: guild.name, iconURL: user.displayAvatarURL({ dynamic: true}) })

        channel.send({ embeds: [pollEmbed]}).then((msg) => {
            for (let i = 0; i < optionsArray.length; i++) {
                msg.react(`${i + 1}\u20E3`);
            }
            return interaction.editReply({ embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`Poll created on the channel ${channel}`)
            ]})
        })
    },
}