const { Events } = require('discord.js')

const { prefix, ownerId } = require('../config.json')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        const spliced = message.content.split(prefix)
        const prefix1 = message.content.charAt(0)
        
        console.log("a")

        if(message.author.id !== ownerId) return
        if(prefix1 !== prefix) return
        
        console.log("b")

        let args = String(spliced[1]).split(" ") || [spliced[1]]

        const client = message.client

        if(args[0] == "add") {
            try {
                console.log("c")
                const command = require('../cmd/add')
                await command.execute(message, args, client)
            } catch (e) {
                console.log(e)
                message.reply("There was an error whilst executing this command!")
            }
        }
    }
}