const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sayi-sayma')
    .setDescription('Sayı sayma oyununu başlat!'),
  async execute(interaction) {
    let currentNumber = 1;

    await interaction.reply(`Sayı sayma oyunu başladı! İlk sayı 1 olmalı. Şu anki sayı: ${currentNumber}`);

    const filter = response => {
      const number = parseInt(response.content);
      return !isNaN(number) && number === currentNumber + 1;
    };

    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    collector.on('collect', async m => {
      const number = parseInt(m.content);
      
      if (number === currentNumber + 1) {
        currentNumber++;
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