const { SlashCommandBuilder } = require('discord.js')

const { tokens } = require('../../tokens.json')

const fs = require('fs');
const path = require('path')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Get the current stock of tokens.'),
  async execute(interaction) {
    let filePath = ""
    let promises = []

    for (let i = 0; i < tokens.length; i++) {
      promises.push(
        new Promise((res, rej) => {
          if(i === 0) {
            let today = new Date().toLocaleDateString()
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
      return await interaction.reply({ content: `\`${tokens.length}\` tokens (\`${tokens.length * 2}\` boosts) in stock right now...\n\n*TXT File with list of tokens has been added to the message*`, files: [filePath], ephemeral: true })
    })
  }
}