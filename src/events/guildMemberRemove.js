const config = require('../../config.json');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const logChannel = member.guild.channels.cache.get(logChannelId);
  
      if (logChannel) {
        logChannel.send(`❌ **Kullanıcı Ayrıldı**: \`${member.user.tag}\``);
      }
    },
  };
  