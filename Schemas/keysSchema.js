const { Schema, model } = require('mongoose')

let keysSchema = new Schema({
    guildId: String,
    key: String,
    period: String,
    unlimited: String,
    owner: String,
})

module.exports = model("keysSchema", keysSchema)