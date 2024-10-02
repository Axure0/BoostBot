const { SlashCommandBuilder } = require('discord.js')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const { Client } = require('discord.js-selfbot-v13');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-token')
    .setDescription('Checks a token to see the amount of boosts on it.')
    .addStringOption(option => 
        option.setName("token")
            .setDescription("The token to check")
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
        const allBoosts = await client.billing.fetchGuildBoosts()

        return interaction.reply({ content: `Token has \`${allBoosts.size}\` boosts.`, ephemeral: true })
    })

    await client.login(token)
        .catch((e) => {
            return interaction.reply({ content: "Invalid token.", ephemeral: true })
        })
  }
}