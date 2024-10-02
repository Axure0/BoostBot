const { SlashCommandBuilder } = require('discord.js')

const { captchaKey } = require('../../config.json')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const timestring = require("timestring")

const { Client } = require('discord.js-selfbot-v13');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-subscription')
    .setDescription("Checks a token's subscription.")
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
        const subscription = await client.billing.fetchCurrentSubscription()
        const boosts = await client.billing.fetchGuildBoosts()

        let timestamp = Date.now()
        let timestamp2 = Date.now()

        if(subscription.size === 0) {
            return interaction.reply({ content: "No active subscription.", ephemeral: true })
        }

        subscription.map((x) => {
            let ts1 = x.current_period_start
                .split("T")

            const ts1s = ts1[0]
                .replace("-", " ")

            timestamp = new Date(`${ts1s} ${ts1[1]}`)

            const ts2 = x.current_period_end
                .split("T")

            const ts2s = ts2[0]
                .replace("-", " ")
            
            timestamp2 = new Date(`${ts2s} ${ts2[1]}`)
        })

        return interaction.reply({ content: `Created at: <t:${timestamp}:F>\nEnds at: <t:${timestamp2}:F>\nBoosts: \`${boosts.size}\`\nPlans: \`${subscription.size}\``, ephemeral: true })
    })

    await client.login(token)
        .catch((e) => {
            return interaction.reply({ content: "Invalid token.", ephemeral: true })
        })
  }
}