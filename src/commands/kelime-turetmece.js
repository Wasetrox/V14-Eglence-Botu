const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kelime-turetmece')
    .setDescription('Kelime türetmece oyununu başlat!'),
  async execute(interaction) {
    let previousWord = '';

    await interaction.reply('Kelime türetmece oyunu başladı! İlk kelimeyi söyleyin.');

    const filter = response => {
      const newWord = response.content;
      // Kelime mantığını burada kontrol edin
      return previousWord === '' || newWord.startsWith(previousWord.slice(-1));
    };

    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    collector.on('collect', async m => {
      const newWord = m.content;

      if (previousWord === '' || newWord.startsWith(previousWord.slice(-1))) {
        previousWord = newWord;
        await m.react('✅'); // Doğruysa emoji
      } else {
        await m.react('❎'); // Yanlışsa emoji
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp('Zaman doldu! Oyun bitti.');
      }
    });
  },
};