const { SlashCommandBuilder } = require('discord.js')

const { boostClient } = require('../../boostClient')

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

    const regex = "/(?:https?://)?discord(?:(?:app)?\.com/invite|\.gg)/?[a-zA-Z0-9]+/?/g"

    console.log(invite.match(regex))

    if(!invite.match(regex)) {
        return interaction.reply({ content: "There was an error whilst executing this command. Please make sure the invite is valid.", ephemeral: true })
    }

    const client = await boostClient(amount, invite)
    .catch((e) => {
        console.log(e)
        return interaction.reply({ content: "There was an error whilst executing this command. Please make sure the invite is valid.", ephemeral: true })
    })

    interaction.reply({ content: `Sent \`${client.amount}x\` boosts to \`${client.guild}\``, ephemeral: true })
  }
}