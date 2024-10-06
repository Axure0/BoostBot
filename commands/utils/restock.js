const { SlashCommandBuilder } = require('discord.js')

const Schema = require('../../Schemas/tokensSchema')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restock')
    .setDescription('Adds a token to the stock.')
    .addStringOption(option =>
        option.setName('token')
            .setDescription('The boost token to restock. (multiple tokens in this format -> token, token2 ...)')
            .setRequired(true)
    ),
  async execute(interaction) {
    let token = interaction.options.getString('token')
    const data = await Schema.findOne({ guildId: interaction.guild.id })

    if(token.includes(" ")) {
        token = token.replace(" ", "")
    }

    let i = 0

    if(token.includes(",")) {
        token = token.split(",")

        token.forEach((t) => {
            data.tokens.push(String(t))
            i = i + 1
        });
    } else {
        data.tokens.push(String(token))
        i = i + 1
    }

    await Schema.findOneAndUpdate({ guildId: interaction.guild.id }, { tokens: data.tokens })

    await interaction.reply({ content: `Added \`${i}\` tokens to the stock.`, ephemeral: true })
  }
}