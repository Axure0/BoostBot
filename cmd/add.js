const Schema2 = require('../Schemas/tokensSchema')
const Schema = require('../Schemas/subscriptionSchema')

module.exports = {
  name: "add",
  async execute(message, args, client) {
    if(!args[1]) {
        return message.reply("Please provide a Guild ID. -# Command Usage: .add <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    if(!args[2]) {
        return message.reply("Please provide a time. -# Command Usage: .add <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    if(!args[3]) {
        return message.reply("Please provide a owner id. -# Command Usage: .add <guildId> <time (in days i.e 30) || unlimited> <ownerId>")
    }

    const data = await Schema.findOne({ guildId: message.guild.id })

    if(data) {
        return message.reply("There is already data for that Guild!")
    }

    if(args[2] == "unlimited") {
        const newData = new Schema({
            guildId: args[1],
            period: "",
            ms: "",
            unlimited: "true",
            owner: args[3],
            whitelisted: []
        })

        await newData.save()
    } else {
        const newData = new Schema({
            guildId: args[1],
            period: args[2],
            ms: Date.now(),
            unlimited: "false",
            owner: args[3],
            whitelisted: []
        })

        await newData.save()
    }

    const newData2 = new Schema2({
        guildId: args[1],
        tokens: [],
        used: []
    })

    await newData2.save()

    return message.reply(`Added \`${args[2]}d\` to the guild's subscription!`)
  }
}