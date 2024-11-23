const config = require('../../config.json');

module.exports = {
    name: 'channelUpdate',
    execute(oldChannel, newChannel) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = newChannel.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`🔧 **Kanal Düzenlendi**: \`${oldChannel.name}\` -> \`${newChannel.name}\``);
      }
    },
  };
  