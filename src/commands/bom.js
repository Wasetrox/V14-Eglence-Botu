const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bom')
    .setDescription('5\'er 5\'er BOM oyununu başlat!'),
  async execute(interaction) {
    let currentNumber = 1;

    // Başlangıç mesajını gönder
    await interaction.reply(`BOM oyunu başladı! 5'in katlarında "BOM" yazmalısınız. İlk sayı 1 olmalı.`);

    // Cevaplar için filter fonksiyonu
    const filter = response => {
      const messageContent = response.content.toLowerCase();
      const number = parseInt(messageContent);

      // Eğer sayı 5'in katı ise "BOM" denmeli, değilse sadece sayı olmalı
      if (currentNumber % 5 === 0) {
        return messageContent === 'bom';
      } else {
        return !isNaN(number) && number === currentNumber;
      }
    };

    // Mesaj kolektörü oluşturuluyor
    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    // Mesajları toplarken yapılacak işlemler
    collector.on('collect', async m => {
      const messageContent = m.content.toLowerCase();

      if (currentNumber % 5 === 0) {
        // Eğer 5'in katı ise ve "BOM" yazıldıysa doğru tepki ver
        if (messageContent === 'bom') {
          await m.react('✅'); // Doğruysa emoji
          currentNumber++; // Sayıyı artır
        } else {
          await m.react('❎'); // Yanlışsa emoji
          // Sayıyı artırma, yanlış cevaptan sonra oyun devam eder
        }
      } else {
        const number = parseInt(messageContent);
        // Eğer sayı doğruysa, tepki ekle ve sayıyı artır
        if (number === currentNumber) {
          await m.react('✅'); // Doğruysa emoji
          currentNumber++; // Sayıyı artır
        } else {
          await m.react('❎'); // Yanlışsa emoji
          // Sayıyı artırma, yanlış cevaptan sonra oyun devam eder
        }
      }

      // Her durumda bir sonraki doğru cevaba geçmek için
      // Burada, yanlış cevaba rağmen currentNumber artırılmaz
    });

    // Zaman dolarsa
    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.followUp('Zaman doldu! Oyun bitti.');
      } else {
        interaction.followUp(`Oyun bitti! Son sayı: ${currentNumber - 1}`);
      }
    });
  },
};
