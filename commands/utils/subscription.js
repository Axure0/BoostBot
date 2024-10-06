const { SlashCommandBuilder } = require('discord.js')

const Schema = require('../../Schemas/subscriptionSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subscription')
        .setDescription('Checks your subscription.'),
    async execute (interaction) {
        const data = await Schema.findOne({ guildId: interaction.guild.id })

        const today = new Date().getTime()
		const dateFrom = Math.floor((today - data.ms) / 1000 / 60 / 60 / 24)

        if(data.unlimited == "true") {
            interaction.reply({ content: `Your guild has an \`unlimited\` subscription.`, ephemeral: true })
        } else {
            interaction.reply({ content: `Your guild has \`${dateFrom}\` days left on the subscription.`, ephemeral: true })
        }
    },
};