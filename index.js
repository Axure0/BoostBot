const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()

require('./deployCommands')()
require('./handler')(client)

client.login(token)