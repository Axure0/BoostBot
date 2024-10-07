const Schema = require('../Schemas/keysSchema')

module.exports = {
    name: "keys",
    async exectute(message, args, client) {
        const data = await Schema.find({})
        
        let msg = []

        data.map((x) => {
            let period = "0"
            if(x.period !== "") {
                period = x.period
            }
            msg.push(`**__${x.guildId}__**\n- Key: \`${x.key}\`\n- Period: \`${period}d\`\n- Unlimited: \`${x.unlimited}\`\n- Owner ID: \`${x.owner}\``)
        })

        let m = msg.join("\n\n")

        await message.author.send(m)

        return message.reply("Sent to your dms!")
    }
}