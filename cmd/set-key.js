const Schema = require('../Schemas/keysSchema')

const { randomUUID } = require('crypto');

module.exports = {
  name: "set-key",
  async execute(message, args, client) {
    if(!args[1]) {
        return message.reply("Please provide a Guild ID. -# Command Usage: .set-key <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    if(!args[2]) {
        return message.reply("Please provide a time. -# Command Usage: .set-key <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    if(!args[3]) {
        return message.reply("Please provide a owner id. -# Command Usage: .set-key <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    const id = randomUUID()

    if(args[2] == "unlimited") {
        const newData = new Schema({
            guildId: args[1],
            key: id,
            period: "",
            unlimited: "true",
            owner: args[3]
        })

        await newData.save()
    } else {
        const newData = new Schema({
            guildId: args[1],
            key: id,
            period: args[2],
            unlimited: "false",
            owner: args[3]
        })

        await newData.save()
    }

    await message.author.send(`Key for guild: \`${args[1]}\`\n\n\`${id}\` -# You can view this key by using .keys to get the list of keys associated with guilds.`)

    return message.reply(`Sent the new key in your dms!`)
  }
}