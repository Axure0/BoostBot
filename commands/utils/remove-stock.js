const { SlashCommandBuilder } = require('discord.js')

const fs = require('fs')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-stock')
    .setDescription('Removes a token from the stock.')
    .addStringOption(option =>
        option.setName('token')
            .setDescription('The boost token to be removed. (multiple tokens in this format -> token, token2 ...)')
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
            data.tokens.forEach((tk) => {
              if(tk === t) {
                const index = data.tokens.indexOf(t)
                data.tokens.splice(index, 1)

                i = i + 1
              }
            })
        });
    } else {
      data.tokens.forEach((tk) => {
        if(tk === token) {
          const index = data.tokens.indexOf(token)
          data.tokens.splice(index, 1)

          i = i + 1
        }
      })
    }

    if(i === 0) {
      return await interaction.reply({ content: `No tokens found with the given query...`, ephemeral: true })
    }

    fs.writeFileSync("./tokens.json", JSON.stringify(data, null, 2))

    await interaction.reply({ content: `Removed \`${i}\` tokens from the stock.`, ephemeral: true })
  }
}