const config = require('../../config.json');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
      const logChannelId = config.logChannelId; // Log kanalının ID'si
      const roleId = config.welcomeRoleId; // Otomatik rolün ID'si
      const logChannel = member.guild.channels.cache.get(logChannelId);
  
      try {
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          await member.roles.add(role);
          logChannel.send(`✅ **Kullanıcı Katıldı**: \`${member.user.tag}\`, ve \`${role.name}\` rolü verildi.`);
        } else {
          logChannel.send(`⚠️ **Kullanıcı Katıldı**: \`${member.user.tag}\`, fakat rol verilemedi.`);
        }
      } catch (error) {
        logChannel.send(`⚠️ **Kullanıcı Katıldı**: \`${member.user.tag}\`, fakat rol verilirken bir hata oluştu.`);
      }
    },
  };
  