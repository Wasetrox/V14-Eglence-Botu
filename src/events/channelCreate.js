const config = require('../../config.json');

module.exports = {
  name: 'channelCreate',
  execute(channel) {
    const logChannelId = config.logChannelId; // Log kanalının ID'si
    const logChannel = channel.guild.channels.cache.get(logChannelId);
    
    if (logChannel) {
      logChannel.send(`📢 **Yeni Kanal Oluşturuldu**: \`${channel.name}\` (ID: ${channel.id})`);
    }
  },
};
