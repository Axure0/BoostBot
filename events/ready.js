const { Events } = require('discord.js');
const mongoose = require('mongoose')

const { AsciiTable3 } = require('ascii-table3')

const { mongoURI } = require('../config.json')

let table = new AsciiTable3('Client')
.setHeading('Event', 'Status')

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const promise = new Promise(async(res, rej) => {
			if(client.isReady()) {
				table.addRow('Ready', '✅');
			} else {
				table.addRow('Ready', '❌');
			}

			try {
				mongoose.connect(mongoURI).then(() => {
					console.log("hey")
					table.addRow('MongoDB', '✅');
				})
			} catch (e) {
				console.log(e)

				table.addRow('MongoDB', '❌');
			}

			res()
		})

		promise.then(() => {
			require('../utils/console')(table)
		})
	},
};