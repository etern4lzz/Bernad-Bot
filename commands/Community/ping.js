const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong'),

  async execute(interaction) {
    await interaction.reply({
      content: 'pong!',
      flags: MessageFlags.Ephemeral
    });
  }
};