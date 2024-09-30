const { SlashCommandBuilder } = require('discord.js')
const { DiscordInviteLinkRegex } = require("@sapphire/discord.js-utilities")

const { boostClient } = require('../../boostClient')

function isOdd(num) {
    return num % 2
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boost')
    .setDescription('Send boosts to a server.')
    .addIntegerOption(option => 
        option.setName("amount")
            .setDescription("The amount of boosts to send.")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("invite")
            .setDescription("The server invite.")
            .setRequired(true)
    ),
  async execute(interaction) {
    let amount = interaction.options.getInteger("amount")
    let invite = interaction.options.getString("invite")

    amount = parseInt(amount)
    invite = String(invite)

    if(isOdd(amount) === 1) {
        return await interaction.reply({ content: "The amount must not be odd!", ephemeral: true })
    }

    if(DiscordInviteLinkRegex.test(invite) === false) {
        return await interaction.reply({ content: "There was an error whilst executing this command. Please make sure the invite is valid.", ephemeral: true })
    }

    await interaction.reply({ content: "Processing... please wait this may take time.", ephemeral: true })

    const client = await boostClient(amount, invite)
    .catch(async (e) => {
        console.log(e)
        return await interaction.editReply({ content: "There was an error whilst executing this command. Please make sure the invite is valid.", ephemeral: true })
    })

    if(client.message === "not enough") {
        return await interaction.editReply({ content: `There are not enough boosts for this, max: \`${client.amount}\`` })
    }

    await interaction.editReply({ content: `Sent \`${client.amount}x\` boosts to <[${client.guild}](${client.invite})>`, ephemeral: true })
  }
}