const config = require('../../config.json');

module.exports = {
    name: 'roleUpdate',
    execute(oldRole, newRole) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = newRole.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`🔧 **Rol Düzenlendi**: \`${oldRole.name}\` -> \`${newRole.name}\``);
      }
    },
  };
  