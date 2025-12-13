const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    Collection
} = require('discord.js');

const path = require('path');
const fs = require('fs');
const config = require('./config/config.json');
const TOKEN = config.PRIVATE.TOKEN;
const CLIENT_ID = config.PRIVATE.CLIENT_ID;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ]
});


// restore commands
client.commands = new Collection();
client.prefixCommands = new Collection();


// load events
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


// read commands (slash commands)
const foldersPath = path.join(__dirname, 'commands');
const readCommands = (dir = foldersPath) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      readCommands(fullPath); // recursive
    } else if (file.name.endsWith('.js')) {
      const command = require(fullPath);
      if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
        console.log(`Loaded command: ${command.data.name}`);
      } else if (command.name) {
        client.prefixCommands.set(command.name, command);
        console.log(`Loaded prefix command: ${command.name}`);
      } else {
        console.log(`[ WARN ] File ${file.name} is missing data.name`);
      }
    }
  }
};

readCommands();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// deploy commands
(async () => {
  try {
    const commandsJSON = client.commands.map(cmd => cmd.data.toJSON());

    console.log(`Started refreshing ${commandsJSON.length} application (/) commands`);

    const data = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commandsJSON },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands`);
  } catch (err) {
    console.error('Error deploying commands:', err);
  }
})();

client.login(TOKEN);