const { Events } = require('discord.js');

const Schema = require('../Schemas/subscriptionSchema')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const data = await Schema.findOne({ guildId: interaction.guild.id })

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if(!data) {
			return interaction.reply({ content: "Your guild doesn't have a subscription to use this bot!", ephemeral: true })
		}

		if(data && data.unlimited == "false") {
			const today = new Date().getTime()
			const dateFrom = Math.floor((today - data.ms) / 1000 / 60 / 60 / 24)

			if(String(dateFrom) >= data.period) {
				interaction.reply({ content: "Your guild subscription has expired.", ephemeral: true })

				return await Schema.deleteOne({ guildId: interaction.guild.id })
			}
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};