const { SlashCommandBuilder } = require('discord.js')

const { tokens } = require('../../tokens.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Checks the current stock of tokens.'),
  async execute(interaction) {
    await interaction.reply({ content: `\`${tokens.length}\` tokens (\`${tokens.length * 2}\` boosts) in stock right now...`, ephemeral: true })
  }
}