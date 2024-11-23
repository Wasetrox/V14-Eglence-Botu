const { Client, GatewayIntentBits, Collection } = require('discord.js');

const fs = require('fs');

const path = require('path');

const config = require('./config.json');

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.MessageContent,

    ],

});

client.commands = new Collection();
client.dccommands = new Collection();


// Komutları yükleme

const commandsPath = path.join(__dirname, 'src', 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);

    const command = require(filePath);
   

    client.commands.set(command.data.name, command);
    client.dccommands.set(command.data.name,command.data)
    
}

// Eventleri yükleme

const eventsPath = path.join(__dirname, 'src', 'events');

const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

    const event = require(path.join(eventsPath, file));
    
    if (event.once) {

        client.once(event.name, (...args) => event.execute(...args, client));

    } else {

        client.on(event.name, (...args) => event.execute(...args, client));

    }

}

// Slash Komutları işleme

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });

    }

});

client.login(config.token);