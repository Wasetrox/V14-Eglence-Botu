const config = require('../../config.json');

module.exports = {
    name: 'channelDelete',
    execute(channel) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = channel.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`❌ **Kanal Silindi**: \`${channel.name}\` (ID: ${channel.id})`);
      }
    },
  };  