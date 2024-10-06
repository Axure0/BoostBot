const { Events } = require('discord.js');
const mongoose = require('mongoose')

const { mongoURI } = require('../config.json')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		mongoose.connect(mongoURI).then(() => {
			console.log("Connected to MongoDB.")
		})
	},
};