const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { randomInt } = require('crypto');
const Config = require('../../config.json');

// Süreyi çözümleyip milisaniye cinsine çeviren yardımcı fonksiyon
function parseDuration(durationStr) {
  let totalMilliseconds = 0;
  const durationRegex = /(\d+)([sdgh])/g; // s = saat, d = dakika, g = gün, h = hafta
  let match;

  while ((match = durationRegex.exec(durationStr)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        totalMilliseconds += value * 60 * 60 * 1000; // Saat
        break;
      case 'd':
        totalMilliseconds += value * 60 * 1000; // Dakika
        break;
      case 'g':
        totalMilliseconds += value * 24 * 60 * 60 * 1000; // Gün
        break;
      case 'h':
        totalMilliseconds += value * 7 * 24 * 60 * 60 * 1000; // Hafta
        break;
      default:
        break;
    }
  }

  return totalMilliseconds;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Bir çekiliş başlat.')
    .addStringOption(option => 
      option.setName('süre')
        .setDescription('Çekiliş süresi (örn. 1s2d: 1 saat 2 dakika)')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('ödül')
        .setDescription('Çekiliş ödülü')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('kazanan_sayısı')
        .setDescription('Çekiliş kazanan sayısı')
        .setRequired(true)),

  async execute(interaction) {
    const durationStr = interaction.options.getString('süre');
    const giveawayPrize = interaction.options.getString('ödül');
    const winnerCount = interaction.options.getInteger('kazanan_sayısı');

    // Süreyi parse ederek milisaniye cinsine dönüştür
    const giveawayDuration = parseDuration(durationStr);

    if (giveawayDuration <= 0) {
      return interaction.reply({ content: 'Geçersiz süre formatı. Lütfen geçerli bir format girin (örn. 1s2d: 1 saat 2 dakika).', ephemeral: true });
    }

    let participants = [];

    // Çekiliş Embed Mesajı
    const giveawayEmbed = new EmbedBuilder()
      .setTitle('🎉 Çekiliş Başladı! 🎉')
      .setDescription(`Katılmak için aşağıdaki butona tıklayın!\n\n**Ödül:** ${giveawayPrize}`)
      .setColor('Random')
      .setFooter({ text: `Çekiliş ${durationStr} sürecek.` });

    // Katılım Butonu (Başlangıçta katılım sayısı 0 olacak)
    const button = new ButtonBuilder()
      .setCustomId('giveaway_enter')
      .setLabel(`Çekilişe Katıl (0)`)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    // Çekiliş Mesajını Gönder
    const giveawayMessage = await interaction.reply({ embeds: [giveawayEmbed], components: [row], fetchReply: true });

    // Buton Etkileşimi Dinleyici
    const filter = (i) => i.customId === 'giveaway_enter';
    const collector = giveawayMessage.createMessageComponentCollector({ filter, time: giveawayDuration });

    collector.on('collect', async (i) => {
      if (!participants.includes(i.user.id)) {
        participants.push(i.user.id);

        // Katılımcı sayısını gösteren butonu güncelle
        const updatedButton = new ButtonBuilder()
          .setCustomId('giveaway_enter')
          .setLabel(`Çekilişe Katıl (${participants.length})`)
          .setStyle(ButtonStyle.Primary);

        const updatedRow = new ActionRowBuilder().addComponents(updatedButton);

        // Mesajı güncelle
        await giveawayMessage.edit({ components: [updatedRow] });

        await i.reply({ content: 'Çekilişe katıldınız!', ephemeral: true });
      } else {
        await i.reply({ content: 'Zaten çekilişe katıldınız!', ephemeral: true });
      }
    });

    collector.on('end', async () => {
      if (participants.length === 0) {
        await interaction.followUp('Çekilişe kimse katılmadı.');
        return;
      }

      // Kazananları seç
      const winners = [];
      for (let i = 0; i < winnerCount; i++) {
        if (participants.length === 0) break;
        const winnerId = participants.splice(randomInt(0, participants.length), 1)[0];
        winners.push(`<@${winnerId}>`);
      }

      // Kazananları duyur
      const winnerMessage = winners.length > 0 
        ? `🎉 Tebrikler, ${winners.join(', ')}! **${giveawayPrize}** ödülünü kazandınız!`
        : 'Çekilişe yeterli katılım olmadı.';

      // Embed'i güncelle (Çekiliş Bitti)
      const endedEmbed = new EmbedBuilder()
        .setTitle('🎉 Çekiliş Sona Erdi! 🎉')
        .setDescription(winnerMessage)
        .setColor('Random')
        .setFooter({ text: 'Çekiliş sona erdi.' });

      await giveawayMessage.edit({ embeds: [endedEmbed], components: [] });

      // Log Kanalına Mesaj Gönder
      const logChannel = interaction.guild.channels.cache.get(Config.GuardLog);
      if (logChannel) {
        logChannel.send(`Çekiliş sonuçlandı! Kazananlar: ${winners.length > 0 ? winners.join(', ') : 'Katılım olmadı'}`);
      }
    });
  }
};
