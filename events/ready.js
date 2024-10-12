const { Events } = require('discord.js');
const mongoose = require('mongoose')

const { AsciiTable3 } = require('ascii-table3')

const { mongoURI } = require('../config.json')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		let table = new AsciiTable3('Client')
		.setHeading('Event', 'Status')

		if(client.isReady()) {
			table.addRowMatrix([
				['Ready', '✅']
			]);
		} else {
			table.addRowMatrix([
				['Ready', '❌']
			]);
		}

		mongoose.connect(mongoURI).then(() => {
			table.addRowMatrix([
				['MongoDB', '✅']
			]);
		})
		.catch((e) => {
			console.log(e)

			table.addRowMatrix([
				['MongoDB', '❌']
			]);
		})

		require('../utils/console')(table)
	},
};