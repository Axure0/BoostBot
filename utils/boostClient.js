const { Client } = require('discord.js-selfbot-v13');

const { captchaKey } = require('../config.json')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const Schema = require('../Schemas/tokensSchema')

async function boostClient (a, invite, interaction) {
  return new Promise(async (resolve, reject) => {
     let amount = parseInt(a)
      if (amount > tokens.length * 2) {
        interaction.followUp({ content: `Not enough tokens... Current stock of boosts are: \`${tokens.length * 2}\``, ephemeral: true })
        return res()
      }

      amount = amount / 2

      let inv = ""

      let x = 0
      let name = ""
      let promises = []

      for(let i = 0; i < amount; i++) {
        promises.push(
          new Promise(async (res, rej) => {
            try {
                let addamount = 2

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
                    console.log(`[${i + 1}/${amount}] ${client.user.tag} is ready to boost!`);
                    
                    const guild = await client.acceptInvite(invite)
                    .catch((e) => {
                        console.log(e)
                        res()
                        return
                    })

                    name = guild.name

                    const splitted = invite.split(".gg/")
                    inv = `https://discord.gg/${splitted[1]}`

                    const data = await Schema.findOne({ guildId: interaction.guild.id })

                    let token
                        
                    if(data.tokens.filter((t) => t === client.token)) {
                      token = client.token
                    }
                    
                    const allBoosts = await client.billing.fetchGuildBoosts()
                    if(allBoosts.size == 0) {
                        interaction.editReply({ content: `[${i + 1}/${amount}] ${client.user.tag} has no boosts.`, ephemeral: true })
                        res()
                        return
                    }
                    let z = 0

                    for(const boost of allBoosts) {
                      if(z < addamount) {
                        await boost.subscribe(guild.id)
                      }
                      z = z + 1
                    }

                    let arr2 = data.used
                    arr2.push(token)
                        
                    let arr = data.tokens
                    const index = arr.indexOf(token)
                    arr.splice(index, 1)
                        
                    await Schema.findOneAndUpdate({ guildId: interaction.guild.id }, { tokens: data.tokens, used: data.used })
                    
                    x = x + 1
                    amount = (amount - addamount)
                    res()
                })

               await client.login(tokens[i])
                    .catch((e) => {
                      console.log(e)
                   	  res()
                      return;
                    })
                } catch (e) {
                   reject(e)
                }
         })
        )
      }

      return Promise.all(promises).then(() => {
        resolve({
          amount: x,
          guild: name,
          invite: inv
        })
      })    
  })
}

module.exports = { boostClient }