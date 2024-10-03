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
    )
    .addBooleanOption(option =>
        option.setName("dm")
            .setDescription("Sends the message to dms.")
            .setRequired(true)
    ),
  async execute(interaction) {
    const token = interaction.options.getString("token")
    const toDms = interaction.options.getBoolean("dm")

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
          "2": "Nitro Boost",
          "3": "Nitro Basic"
        }

        let bio = "No Description."

        if(client.user.fetch().bio) {
          bio = client.user.fetch().bio
        }
        
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.tag}`)
        .setDescription(`${bio}`)
        .setColor(client.user.fetch().accentColor ?? "Green")
        .setFields(
          { name: "User ID", value: `${client.user.id}`, inline: true },
          { name: "2FA Enabled", value: `${client.user.mfaEnabled}`, inline: true },
          { name: "Verified", value: `${client.user.verified}`, inline: true },
          { name: "Phone Number", value: `${client.user.phone ?? "Not Set"}`, inline: true },
          { name: "Boosts", value: `${boosts.size}`, inline: true },
          { name: "Nitro", value: `${premiumObj[String(client.user.premiumType)]}`, inline: true }
        )
        .setThumbnail(client.user.avatarURL() ?? "https://ia600305.us.archive.org/31/items/discordprofilepictures/discordblue.png")

        if(String(client.user.premiumType) !== "0") {
          let startedt = Date.now()
          let endst = Date.now()

          subscription.map((x) => {
            startedt = Math.floor(new Date(x.current_period_start).getTime() / 1000)
            endst = Math.floor(new Date(x.current_period_end).getTime() / 1000)
          })
          embed.addFields(
            { name: "Nitro Started", value: `<t:${startedt}>`, inline: true },
            { name: "Nitro Ends", value: `<t:${endst}>`, inline: true }
          )
        }

        async function dm() {
          await interaction.reply({ content: "Sent to dms.", ephemeral: true })
          return await interaction.user.send({ embeds: [embed] })
        }

        return toDms 
          ? await dm()
          : interaction.reply({ embeds: [embed], ephemeral: true })

    })

    await client.login(token)
        .catch((e) => {
            return interaction.reply({ content: "Invalid token.", ephemeral: true })
        })
  }
}