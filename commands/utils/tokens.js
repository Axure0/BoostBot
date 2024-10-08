const { SlashCommandBuilder } = require('discord.js')

const Schema = require('../../Schemas/tokensSchema')

const fs = require('fs');
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tokens')
    .setDescription('Get the current stock of tokens.'),
  async execute(interaction) {
    let filePath = ""
    let promises = []

    const data = await Schema.findOne({ guildId: interaction.guild.id })
    const tokens = data.tokens

    if(tokens.length == 0) {
      return interaction.reply({ content: "There are no tokens.", ephemeral: true })
    }

    for (let i = 0; i < tokens.length; i++) {
      promises.push(
        new Promise((res, rej) => {
          if(i === 0) {
            let today = new Date().toLocaleDateString()
            today = today.replace(/\//g, "-")
            let ran = Math.floor(100000000 + Math.random() * 900000000);
    
            filePath = path.join(__dirname, `${today}-${ran}.txt`)
    
            fs.writeFile(filePath, `${tokens[i]}`, function (err) {
              if (err) console.log(err)
              res()
            });
          } else {
            fs.appendFile(filePath, `${tokens[i]}`, function (err) {
              if (err) console.log(err)
              res()
            });
          }
        })
      )
    }

    Promise.all(promises).then(async () => {
      await interaction.reply({ content: `\`${tokens.length}\` tokens (\`${tokens.length * 2}\` boosts) in stock right now...\n\n-# TXT File with a list of tokens has been added to the message.`, files: [filePath], ephemeral: true })
    
      fs.unlink(filePath, function(err) {
        if(err) console.log(err)
        return
      })
    })
  }
}