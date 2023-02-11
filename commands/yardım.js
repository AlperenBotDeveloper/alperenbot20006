const { Client, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
  name: "yardım",
  description: "Botun yardım menüsüne bakarsın!",
  type: 1,
  options: [],

  run: async(client, interaction) => {

    const embed = new EmbedBuilder()
    .setTitle("Alperen Bot Yardım Menüsü")
    .setThumbnail('https://cdn.discordapp.com/avatars/794620407473897472/8bcb13442b07691a9b5952e057b99df6.png?size=4096')
    .setImage("https://media.discordapp.net/attachments/792388025443024936/794317376820215828/standard_9.gif")
    .setDescription(`
> **prefix:** **/**
> 👑 \`Developer\` **<@595605651531759627> <@758388752321740841>**

> **Ana Komutlar**
> 🎃 \`Moderasyon\` **hakkında bilgi alabilirsiniz.**
> 🎙️ \`Kayıt\` **hakkında bilgi alabilirsiniz**
> 🧑‍🤝‍🧑 \`Kullanıcı\` **hakkında bilgi alabilirsiniz.**
> 🔋 \`uptime\` **hakkında bilgi alabilirsiniz.**
> 🔒 \`Privacy Policy\` **Gizlilik Politikası**

**Bağlantılar**
> ☀️ [Destek Sunucusu](https://discord.gg/3gXvsZNs5p)
> 🌴 [Botu Ekle](https://discord.com/oauth2/authorize?client_id=796255738506903572&scope=bot&permissions=805829694)
> 🕶️ [Oyver](https://top.gg/bot/796255738506903572/vote)`)
.setColor("#000000")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Moderasyon")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("oderasyon"),
new Discord.ButtonBuilder()
.setLabel("Uptime")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("Uptime"),
new Discord.ButtonBuilder()
.setLabel("Kayıt")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("Kayıt"),
new Discord.ButtonBuilder()
.setLabel("Privacy Policy")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("Privacy Policy"),
new Discord.ButtonBuilder()
.setLabel("Kullanıcı")
.setStyle(Discord.ButtonStyle.Primary)
.setCustomId("Kullanıcı"))
interaction.reply({embeds: [embed], components: [row], ephemeral: true})
  }

};
