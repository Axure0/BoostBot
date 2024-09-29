const { SlashCommandBuilder } = require('discord.js')

const tokensData = require('../../tokens.json')

const fs = require('fs')

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

    if(token.includes(" ")) {
        token = token.replace(" ", "")
    }

    let i = 0

    if(token.includes(",")) {
        token = token.split(",")

        token.forEach((t) => {
            tokensData.tokens.push(String(t))
            i = i + 1
        });
    } else {
        tokensData.tokens.push(String(token))
        i = i + 1
    }

    fs.writeFileSync("./tokens.json", JSON.stringify(tokensData, null, 2))

    await interaction.reply({ content: `Added \`${i}\` tokens to the stock.`, ephemeral: true })
  }
}