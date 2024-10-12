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

			const promise2 = new Promise(async (reso, rej) => {
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
				reso()
			})

			promise2.then(() => {
				res()
			})
		})

		promise.then(() => {
			require('../utils/console')(table)
		})
	},
};