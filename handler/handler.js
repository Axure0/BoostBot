const fs = require('fs')
const path = require('path')

const { AsciiTable3 } = require('ascii-table3')

let table = new AsciiTable3('Slash Commands')
.setHeading('Command', 'Loaded')

let table3 = new AsciiTable3('Message Commands')
.setHeading('Command', 'Loaded')

let table2 = new AsciiTable3('Events')
.setHeading('Event', 'Loaded')

module.exports = (client) => {
    const foldersPath = path.join(__dirname, "..", 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    const promise = new Promise(async (res, rej) => {
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);

                    table.addRowMatrix([
                        [file.replace(".js", ""), '✅']
                    ])
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                
                    table.addRowMatrix([
                        [file.replace(".js", ""), '❌']
                    ])
                }
            }
        }
    
        const mPath = path.join(__dirname, "..", 'cmd');
        const mFolder = fs.readdirSync(mPath).filter(file => file.endsWith('.js'));
    
        for(const mfile of mFolder) {
            const fPath = path.join(mPath, mfile);
            const f = require(fPath)
    
            if("disabled" in f && f.disabled === true) continue;
    
            if("name" in f && "execute" in f) {
                client.mcommands.set(f.name, f);

                table3.addRowMatrix([
                    [mfile.replace(".js", ""), '✅']
                ])
            } else {
                console.log(`[WARNING] The command at ${fPath} is missing a required "name" or "execute" property.`);
            
                table3.addRowMatrix([
                    [mfile.replace(".js", ""), '❌']
                ])
            }
        }
    
        const eventsPath = path.join(__dirname, "..", 'events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            table2.addRowMatrix([
                [file.replace(".js", ""), '✅']
            ])
        }

        res()
    })

    promise.then(() => { 
        require('../utils/console')([table, table2, table3]) 
    })
}