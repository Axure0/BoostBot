const { Events } = require('discord.js')

const { prefix, ownerId } = require('../config.json')

const fs = require('fs')
const path = require('path')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        const spliced = message.content.split(prefix)
        const prefix1 = message.content.charAt(0)

        if(message.author.id !== ownerId) return
        if(prefix1 !== prefix) return

        let args = String(spliced[1]).split(" ") || [spliced[1]]

        const client = message.client

        const commands = []

        const folderPath = path.join(__dirname, "..", 'cmd');
        const commandFolder = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for(const file of commandFolder) {
            const fPath = path.join(folderPath, file);
            const f = require(fPath)

            if("disabled" in f && f.disabled === true) continue;

            if("name" in f) {
                commands.push({ file: `${file}`, cmd: `${f.name}` })
            }
        }

        if(commands.some((e) => e.cmd == args[0]) === true) {
            let x = []
            commands.forEach((y) => {
                if(y.cmd == args[0]) {
                    x = y
                }
            })

            if(x.length === 0) return
            try {
                const command = require(`../cmd/${x.file}`)
                await command.execute(message, args, client)
            } catch (e) {
                console.log(e)
                message.reply("There was an error whilst executing this command!")
            }
        }
    }
}