const {
  Events,
  ActivityType
} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
      console.log("Logged in!")
      client.user.setPresence({
        activities: [{
          name: "Bernad Good",
          type: ActivityType.Watching 
        }],
        status: 'idle',
      })
    }
}
