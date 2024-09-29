const { Client } = require('discord.js-selfbot-v13');

const { tokens } = require('./tokens.json')
const tokenData = require('./tokens.json')
const { captchaKey, emptyTransfer } = require('./config.json')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const fs = require('fs'); 

async function boostClient (a, invite) {
  return new Promise(async (resolve, reject) => {
     let amount = parseInt(a)
      if (amount > tokens.length) {
        amount = tokens.length
      }
      let x = 0
      let promises = []
      for(let i = 0; i < amount; i++) {
        promises.push(
          new Promise((res, rej) => {
            try {
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
                    
                    const allBoosts = await client.billing.fetchGuildBoosts()
                    if(emptyTransfer === "true" && allBoosts.size == 0) {
                        console.log(`[${i + 1}/${amount}] ${client.user.tag} has no boosts. Removing token...`)
                        
                        let token
                        
                        tokens.forEach((t) => {
                            if(t === client.token) {
                                token = t
                            }
                        })

                        if(!token) {
                            res()
                            return
                        }
                        
                        let arr2 = tokenData.empty
                        arr2.push(token)
                        tokenData.empty = arr2
                        
                        let arr = tokenData.tokens
                        const index = arr.indexOf(token)
                        arr.splice(index, 1)
                        tokenData.tokens = arr
                        
                        fs.writeFileSync('./tokens.json', JSON.stringify(tokenData, null, 2));
                        res()
                        return
                    }
                    for(const boost of allBoosts) {
                        await boost.subscribe(guild.id)
                    }
                    
                    x = x + 1
                    res()
                })

               client.login(tokens[i])
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
        resolve(x)
      })    
  })
}

module.exports = { boostClient }