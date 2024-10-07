const Schema2 = require('../../Schemas/tokensSchema')
const Schema = require('../../Schemas/subscriptionSchema')
const Schema3 = require('../../Schemas/keysSchema')

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    permitted: true,
    data: new SlashCommandBuilder()
        .setName('redeem-key')
        .setDescription('Redeems a subscription key to use this bot.')
        .addStringOption(option =>
            option.setName('key')
                .setDescription('The key to redeem.')
                .setRequired(true)
        ),
    async execute (interaction) {
        const key = interaction.options.getString("key")
        const data = await Schema3.findOne({ key: key })

        if(!data) {
            return interaction.reply({ content: "This key does not exist!", ephemeral: true })
        }

        const data2 = await Schema.findOne({ guildId: data.guildId })
    
        if(data2) {
            return message.reply("This guild already has an active subscription!")
        }
    
        if(data.unlimited == "true") {
            const newData = new Schema({
                guildId: data.guildId,
                period: "",
                ms: "",
                unlimited: "true",
                owner: data.owner,
                whitelisted: []
            })
    
            await newData.save()
        } else {
            const newData = new Schema({
                guildId: data.guildId,
                period: data.period,
                ms: Date.now(),
                unlimited: "false",
                owner: data.owner,
                whitelisted: []
            })
    
            await newData.save()
        }
    
        const newData2 = new Schema2({
            guildId: data.guildId,
            tokens: [],
            used: []
        })
    
        await newData2.save()

        await Schema3.deleteOne({ key: key })

        return message.reply(`Added \`${args[2]}d\` to the guild's subscription!`)
    },
};