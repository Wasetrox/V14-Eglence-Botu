const config = require('../../config.json');

module.exports = {
    name: 'roleCreate',
    execute(role) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = role.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`🆕 **Yeni Rol Oluşturuldu**: \`${role.name}\` (ID: ${role.id})`);
      }
    },
  };
  