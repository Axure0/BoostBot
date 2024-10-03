const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const { captchaKey } = require('../../config.json')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const { Client } = require('discord.js-selfbot-v13');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-token')
    .setDescription("Checks a token's details.")
    .addStringOption(option => 
        option.setName("token")
            .setDescription("The token to check.")
            .setRequired(true)
    ),
  async execute(interaction) {
    const token = interaction.options.getString("token")

    const client = new Client({
        captchaSolver: function (captcha, UA) {
        return solver
          .hcaptcha(captcha.captcha_sitekey, 'discord.com', {
            invisible: 1,
            userAgent: UA,
            data: captcha.captcha_rqdata,
          })
          .then(res => res.data);
      },
      captchaRetryLimit: 3,
    });

    client.on('ready', async () => {
        const boosts = await client.billing.fetchGuildBoosts()
        const subscription = await client.billing.fetchCurrentSubscription()

        const premiumObj = {
          "0": "No Nitro",
          "1": "Nitro Classic",
          "2": "Nitro",
          "3": "Nitro Basic"
        }
        
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.tag}`)
        .setDescription(`${client.user.fetch().bio}`)
        .setColor(client.user.fetch().accentColor ?? "Green")
        .setFields(
          { name: "2FA Enabled", value: `${client.user.mfaEnabled}`, inline: true },
          { name: "Verified", value: `${client.user.verified}`, inline: true },
          { name: "Phone Number", value: `${client.user.phone}`, inline: true },
          { name: "Boosts", value: `${boosts.size}`, inline: true },
          { name: "Nitro", value: `${premiumObj[String(client.user.premiumType)]}`, inline: true }
        )
        .setThumbnail(client.user.avatarURL())

        if(String(client.user.premiumType) !== "0") {
          let startedt = Date.now()
          let endst = Date.now()

          subscription.map((x) => {
            const [y, m, d] = x.current_peroid_start.split("-")
            const ts1 = new Date(`${d} ${m} ${y}`)

            startedt = ts1.getTime()

            const [y1, m1, d1] = x.current_period_end.split("-")
            const ts2 = new Date(`${d1} ${m1} ${y1}`)

            endst = ts2.getTime()
          })
          embed.addFields(
            { name: "Nitro Started", value: `<t:${startedt}>`, inline: true },
            { name: "Nitro Ends", value: `<t:${endst}>`, inline: true }
          )
        }

        return interaction.reply({ embeds: [embed], ephemeral: true })
    })

    await client.login(token)
        .catch((e) => {
            return interaction.reply({ content: "Invalid token.", ephemeral: true })
        })
  }
}