const { SlashCommandBuilder } = require('discord.js')

const Schema = require('../../Schemas/subscriptionSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist a user to use this bot.')
        .addUserOption(option => 
            option.setName("user")
                .setDescription("The user to whitelist.")
                .setRequired(true)
        ),
    async execute (interaction) {
        const data = await Schema.findOne({ guildId: interaction.guild.id })
        let array = data.whitelisted

        const user = interaction.options.getUser("user")

        array.push(user.id)

        await Schema.findOneAndUpdate({ guildId: interaction.guild.id }, { whitelisted: array })

        return interaction.reply({ content: `Successfully whitelisted <@${user.id}>`, ephemeral: true })
    },
};