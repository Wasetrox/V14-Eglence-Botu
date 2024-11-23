const config = require('../../config.json');

module.exports = {
    name: 'roleDelete',
    execute(role) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = role.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`❌ **Rol Silindi**: \`${role.name}\` (ID: ${role.id})`);
      }
    },
  };  