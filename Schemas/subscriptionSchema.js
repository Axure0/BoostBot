const { Schema, model } = require('mongoose')

let subscriptionSchema = new Schema({
    guildId: String,
    period: String,
    ms: String,
    unlimited: String,
    owner: String,
    whitelisted: Array
})

module.exports = model("subscriptionSchema", subscriptionSchema)