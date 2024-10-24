const { Events } = require('discord.js')

const { prefix, ownerId } = require('../config.json')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        const spliced = message.content.split(prefix)
        const prefix1 = message.content.charAt(0)

        if(message.author.id !== ownerId) return

        let args = String(spliced[1]).split(" ") || [spliced[1]]

        const client = message.client

        const command = client.mcommands.get(args[0]);
        if (!command) return

        if(prefix1 !== command?.prefix || prefix1 !== prefix) return

        try {
			await command.execute(message, args, client);
		} catch (error) {
			console.log(error);
			if (interaction.replied || interaction.deferred) {
                message.reply("There was an error whilst executing this command!")
			} else {
                message.reply("There was an error whilst executing this command!")
			}
		}
    }
}