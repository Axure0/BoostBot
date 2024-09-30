const { SlashCommandBuilder } = require('discord.js')

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

    const data = JSON.parse(fs.readFileSync('./tokens.json', "utf8"))

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

    fs.writeFileSync("./tokens.json", JSON.stringify(data, null, 2))

    await interaction.reply({ content: `Added \`${i}\` tokens to the stock.`, ephemeral: true })
  }
}