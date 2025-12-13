const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`[ Status ] Ready! Logged in as ${client.user.tag}`);

    client.user.setActivity({
      name: 'Chilling',
      type: ActivityType.Watching
    });
  }
};