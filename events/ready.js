const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  execute(client) { // fix async 
    console.log(`[ Status ] Ready! Logged in as ${client.user.tag}`);
    
    // Improve the activity 
    client.user.setPresence({
      activities: [{
        name: "Bernad good's",
        type:  ActivityType.Watching
      }],
      status: 'idle'
    })
  }
};
