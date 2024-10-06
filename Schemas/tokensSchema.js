const { Schema, model } = require('mongoose')

let tokensSchema = new Schema({
    guildId: String,
    tokens: Array,
    used: Array
})

module.exports = model("tokensSchema", tokensSchema)