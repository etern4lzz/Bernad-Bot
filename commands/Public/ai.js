const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const handlerAi = require('../../handlers/handlerAi');
const config = require('../../config/config.json');
const API_KEY = config.PRIVATE.API_KEY;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Tanya apapun ke Bernad!')
    .addStringOption(opt =>
      opt
        .setName('question')
        .setDescription('Tulis pertanyaanmu')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pertanyaan = interaction.options.getString('question');

    await interaction.deferReply();

    try {
      const result = await handlerAi(
        API_KEY,
        [
          {
            role: 'system',
            content:
              'Bernad, orang Jawa. Jawab pertanyaan user dengan bahasa santai, agak gaul, tapi sopan dan ga toxic.'
          },
          {
            role: 'user',
            content: pertanyaan
          }
        ],
        {
          siteTitle: 'Bernad Bot'
        }
      );

      const jawaban = result.choices[0].message.content;

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('💬 Bernad jawab')
        .setDescription(jawaban)
        .setFooter({ text: 'Powered by OpenRouter AI' });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply(
        'Waduh, Bernad lagi error nih. Coba lagi bentar ya.'
      );
    }
  }
};