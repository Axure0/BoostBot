const { Client } = require('discord.js-selfbot-v13');

const { tokens } = require('./tokens.json')
const tokenData = require('./tokens.json')
const { captchaKey, emptyTransfer } = require('./config.json')

const Captcha = require('2captcha');
const solver = new Captcha.Solver(captchaKey);

const fs = require('fs'); 

function isOdd(num) { 
  return num % 2
}

async function boostClient (a, invite) {
  return new Promise(async (resolve, reject) => {
     let amount = parseInt(a)
      if (amount > tokens.length) {
        amount = tokens.length
      }

      let x = 0
      let name = ""
      let promises = []
      for(let i = 0; i < amount; i++) {
        promises.push(
          new Promise((res, rej) => {
            try {
                let addamount = 2

                if(isOdd(amount) === 0) {
                  amount = (amount / 2)
                }

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

                    const fetch = require('node-fetch');

                    let checkInv = invite
                      if(invite.startsWith("https://")){
                        checkInv = invite
                      } else {
                        checkInv = `https://${invite}`
                      }

                      fetch(checkInv)
                      .then((res) => res.json())
                      .then((json) => {
                        if (json.message === 'Unknown Invite') {
                          rej()
                          return;
                        }
                      })
                      .catch((e) => { throw e })
                    
                    const guild = await client.acceptInvite(invite)
                    .catch((e) => {
                        console.log(e)
                        res()
                        return
                    })

                    name = guild.name

                    if(isOdd(amount) === 1) {
                      addamount = 1
                    } else {
                      addamount = 2
                    }
                    
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
                    for(let i = 0; i < addamount; i++) {
                      await boost.subscribe(guild.id)
                    }
                    
                    x = x + 1
                    amount = (amount - addamount)
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
        resolve({
          amount: x,
          guild: name
        })
      })    
  })
}

module.exports = { boostClient }