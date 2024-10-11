const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
] })

client.commands = new Collection()
client.mcommands = new Collection()

require('./deployCommands')()
require('./handler')(client)

client.login(token)