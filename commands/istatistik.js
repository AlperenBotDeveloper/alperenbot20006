const { Client, EmbedBuilder } = require("discord.js");
const moment = require("moment");
  require("moment-duration-format");
  const os = require("os");
module.exports = {
  name: "istatistik",
  description: "Botun istatistiğini görürsün!",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    const Uptime = moment
    .duration(client.uptime)
    .format(" D [gün], H [saat], m [dakika], s [saniye]");
    const embed = new EmbedBuilder()
    .setColor('#000000')
    .setThumbnail('https://cdn.discordapp.com/avatars/794620407473897472/8bcb13442b07691a9b5952e057b99df6.png?size=4096')
    .addFields({ name: 'Bot Sahibi', value: `<@595605651531759627> <@758388752321740841>`, inline: false})
    .addFields({ name: 'Bellek Kullanımı', value: `${(process.memoryUsage().heapUsed /1024 /512).toFixed(2)}MB`, inline: true})
    .addFields({ name: 'Çalışma Süresi', value: `${Uptime}`, inline: true})
    .addFields({ name: 'Kullanıcılar', value: `${client.users.cache.size}`, inline: false})
    .addFields({ name: 'Sunucular', value: `${client.guilds.cache.size}`, inline: false})
    .addFields({ name: 'Kanallar', value: `${client.channels.cache.size}`, inline: false})
    .addFields({ name: 'Onaylanma Tarih', value: `02.02.2021`, inline: false})
    .addFields({ name: 'En Son Güncellenme Tarih', value: `10.02.2023`, inline: false})
    .addFields({ name: 'Discord.JS sürüm', value: `14.2.0`, inline: true})
    .addFields({ name: 'Node.JS sürüm', value: `v16.14.2`, inline: true})
    .addFields({ name: 'Bot Kuruluş', value: `02.01.2021`, inline: true})
    .addFields({ name: 'Komut Sayısı', value: `30`, inline: true})
    .addFields({ name: 'Ping', value: `${client.ws.ping}`, inline: true})
    interaction.reply({embeds: [embed]})
  }

};