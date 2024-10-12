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
				table.addRowMatrix([
					['Ready', '✅']
				]);
			} else {
				table.addRowMatrix([
					['Ready', '❌']
				]);
			}

			try {
				mongoose.connect(mongoURI).then(() => {
					table.addRowMatrix([
						['MongoDB', '✅']
					]);
				})
			} catch (e) {
				console.log(e)

				table.addRowMatrix([
					['MongoDB', '❌']
				]);
			}

			res()
		})

		promise.then(() => {
			require('../utils/console')(table)
		})
	},
};