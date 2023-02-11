const { Client, PermissionsBitField,EmbedBuilder, ButtonStyle, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const db = require("croxydb")
const louritydb = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;

 const props = require(`./commands/${f}`);

 client.commands.push({
       name: props.name.toLowerCase(),
       description: props.description,
       options: props.options,
       dm_permission: props.dm_permission,
       type: 1
 });

console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });
console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(process.env.token)

// Uptime Modal
const lourityModal = new ModalBuilder()
    .setCustomId('form')
    .setTitle('Link Ekle')
const u2 = new TextInputBuilder()
    .setCustomId('link')
    .setLabel('Proje Linkinizi Giriniz')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(8)
    .setMaxLength(200)
    .setPlaceholder('https://mercy-code.glitch.me')
    .setRequired(true)

const row1 = new ActionRowBuilder().addComponents(u2);
lourityModal.addComponents(row1);


const lourityModal2 = new ModalBuilder()
    .setCustomId('form2')
    .setTitle('Link Sil')
const u3 = new TextInputBuilder()
    .setCustomId('baslik1')
    .setLabel('Proje Linkini Giriniz')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(8)
    .setMaxLength(200)
    .setPlaceholder('https://mercy-code.glitch.me')
    .setRequired(true)

const row2 = new ActionRowBuilder().addComponents(u3);
lourityModal2.addComponents(row2);

// Uptime Kanala Gönderme
client.on('interactionCreate', async interaction => {

    if (interaction.commandName === "uptime-ayarla") {

        const row = new Discord.ActionRowBuilder()

            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Ekle")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setCustomId("ekle")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Sil")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setCustomId("sil")
            )
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Linklerim")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setCustomId("linklerim")
            )

        const server = interaction.guild
        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let channel = sistem.kanal

        const uptimeMesaj = new Discord.EmbedBuilder()
            .setColor("4e6bf2")
            .setTitle("Uptime Servisi")
            .setDescription("`・` Projelerinizi uptime etmek için **Ekle** butonuna tıklayın\n`・` Uptime edilen linklerinizi silmek için **Sil** butonuna tıklayın\n`・` Eklenen linklerini görmek için **Linklerim** butonuna tıklayın")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setFooter({ text: "Mercy Code" })

        interaction.guild.channels.cache.get(channel).send({ embeds: [uptimeMesaj], components: [row] })

    }

})

// Uptime Ekle
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "ekle") {

        await interaction.showModal(lourityModal);
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {

        if (!louritydb.fetch(`uptimeLinks_${interaction.user.id}`)) {
            louritydb.set(`uptimeLinks_${interaction.user.id}`, [])
        }

        const link = interaction.fields.getTextInputValue("link")

        let link2 = louritydb.fetch(`uptimeLinks_${interaction.user.id}`, [])

        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let ozelrol = sistem.rol
        let log = sistem.log
        if (!log) return;
        var logChannel = client.channels.cache.get(log)

        if (!link) return;

        if (!interaction.member.roles.cache.has(ozelrol)) {
            if (louritydb.fetch(`uptimeLinks_${interaction.user.id}`).length >= 3) {
                return interaction.reply({
                    content: "En fazla 3 link ekleyebilirsin!",
                    ephemeral: true
                }).catch(e => { })
            }
        }
        // LİMİT AYARLARI BURADAN YAPILIR
        if (interaction.member.roles.cache.has(ozelrol)) {
            if (louritydb.fetch(`uptimeLinks_${interaction.user.id}`).length >= 5) {
                return interaction.reply({
                    content: "En fazla 5 link ekleyebilirsin!",
                    ephemeral: true
                }).catch(e => { })
            }
        }

        if (link2.includes(link)) {
            return interaction.reply({
                content: "Bu link zaten sistemde mevcut!",
                ephemeral: true
            }).catch(e => { })
        }

        if (!link.startsWith("https://")) {
            return interaction.reply({
                content: "Uptime linkin hatalı, lütfen başında `https://` olduğundan emin ol!",
                ephemeral: true
            }).catch(e => { })
        }

        if (!link.endsWith(".glitch.me")) {
            return interaction.reply({
                content: "Uptime linkin hatalı, lütfen sonunda `.glitch.me` olduğundan emin ol!",
                ephemeral: true
            }).catch(e => { })
        }

        if (link.includes("uptime")) {

            const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`<@${interaction.user.id}> adlı kullanıcı sisteme **uptime botu** eklemeye çalıştı!`)

            logChannel.send({ embeds: [logEmbed] }).catch(e => { })

            return interaction.reply({
                content: "Sistemimize uptime botu ekleyemezsin!",
                ephemeral: true
            }).catch(e => { })
        }


        louritydb.push(`uptimeLinks_${interaction.user.id}`, link)
        louritydb.push(`uptimeLinks`, link)
        interaction.reply({
            content: "Linkin başarıyla uptime sistemine eklendi!",
            ephemeral: true
        }).catch(e => { })

        const logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<@${interaction.user.id}> adlı kullanıcı sisteme bir link ekledi!\n\n:link: Link: \`${link}\``)

        logChannel.send({ embeds: [logEmbed] }).catch(e => { })
    }
})


// Uptime Sil
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "sil") {

        await interaction.showModal(lourityModal2);
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form2') {

        let sistem = louritydb.get(`uptimeSistemi_${interaction.guild.id}`)
        if (!sistem) return;
        let log = sistem.log
        if (!log) return;
        var logChannel = client.channels.cache.get(log)

        const links = louritydb.get(`uptimeLinks_${interaction.user.id}`)
        let linkInput = interaction.fields.getTextInputValue("baslik1")

        if (!links.includes(linkInput)) return interaction.reply({ content: "Sistemde böyle bir link mevcut değil!", ephemeral: true }).catch(e => { })

        louritydb.unpush(`uptimeLinks_${interaction.user.id}`, linkInput)
        louritydb.unpush(`uptimeLinks`, linkInput)

        interaction.reply({ content: "Linkin başarıyla sistemden silindi!", ephemeral: true }).catch(e => { })

        const logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<@${interaction.user.id}> adlı kullanıcı sistemden bir **link sildi!**\n\n:link: Link: \`${linkInput}\``)

        logChannel.send({ embeds: [logEmbed] }).catch(e => { })
    }
})

// Linklerim
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "linklerim") {

        const rr = louritydb.get(`uptimeLinks_${interaction.user.id}`)
        if (!rr) return interaction.reply({ content: "Sisteme eklenmiş bir linkin yok!", ephemeral: true })

        const links = louritydb.get(`uptimeLinks_${interaction.user.id}`).map(map => `▶️ \`${map}\` `).join("\n")

        const linklerimEmbed = new EmbedBuilder()
            .setTitle(`Uptime Linklerin`)
            .setDescription(`${links || "Sisteme eklenmiş bir link yok!"}`)
            .setFooter({ text: "Mercy Code" })
            .setColor("Blurple")

        interaction.reply({
            embeds: [linklerimEmbed],
            ephemeral: true
        }).catch(e => { })

    }
})

client.on("guildMemberAdd", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `✔️ | ${member} sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})

client.on("messageCreate", async message => {
  const db = require("croxydb");

  if (await db.get(`afk_${message.author.id}`)) {
   
    db.delete(`afk_${message.author.id}`);

    message.reply("Afk Modundan Başarıyla Çıkış Yaptın!");
  }

  var kullanıcı = message.mentions.users.first();
  if (!kullanıcı) return;
  var sebep = await db.get(`afk_${kullanıcı.id}`);

  if (sebep) {
    message.reply("Etiketlediğin Kullanıcı **"+sebep+"** Sebebiyle Afk Modunda!");
  }
});
client.on("guildMemberAdd", member => {
  const rol = db.get(`otorol_${member.guild.id}`)
  if(!rol) return;
  member.roles.add(rol).catch(() => {})

})
client.on("guildMemberAdd", member => {
  const tag = db.get(`ototag_${member.guild.id}`)
  if(!tag) return;
  member.setNickname(`${tag} | ${member.displayName}`)
})
client.on("guildMemberRemove", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `❌ | ${member} sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})

client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let kufur = db.fetch(`kufurengel_${message.guild.id}`)
  if(!kufur) return;
  
  if(kufur) {
  const kufurler = [
    
    "amk",
    "piç",
    "yarrak",
    "oç",
    "göt",
    "amq",
    "yavşak",
    "amcık",
    "amcı",
    "orospu",
    "sikim",
    "sikeyim",
    "aq",
    "mk"
       
  ]
  
if(kufurler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Hey <@${message.author.id}>, Bu Sunucuda Küfür Engel Sistemi Aktif! `)
}
}
})
client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`)
  if(!reklamlar) return;
  
  if(reklamlar) {

  const linkler = [
    
    ".com.tr",
    ".net",
    ".org",
    ".tk",
    ".cf",
    ".gf",
    "https://",
    ".gq",
    "http://",
    ".com",
    ".gg",
    ".porn",
    ".edu",
    "discord.app",
    "discord.gg",
    ".party",
    ".com",
    ".az",
    ".net",
    ".io",
    ".gg",
    ".me",
    "https",
    "http",
    ".com.tr",
    ".org",
    ".tr",
    ".gl",
    "glicht.me/",
    ".rf.gd",
    ".biz",
    "www.",
    "www"
       
  ]
  
if(linkler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Hey <@${message.author.id}>, Bu Sunucuda Reklam Engel Sistemi Aktif! `)
}
}
})

client.on("messageCreate", (message) => {
  
  let saas = db.fetch(`saas_${message.guild.id}`)
  if(!saas) return;
  
  if(saas) {
  
  let selaamlar = message.content.toLowerCase()  
if(selaamlar === 'sa' || selaamlar === 'slm' || selaamlar === 'sea' || selaamlar === ' selamünaleyküm' || selaamlar === 'Selamün Aleyküm' || selaamlar === 'selam'){

message.channel.send(`<@${message.author.id}> Aleykümselam, Hoşgeldin ☺️`)
}
}
})
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  let message = await interaction.channel.messages.fetch(interaction.message.id)  
  if(interaction.customId == "moderasyon") {
const embed = new Discord.EmbedBuilder()
.setTitle("Moderasyon Yardım Menüsü!")
.setThumbnail('https://media.discordapp.net/attachments/1022843509016895568/1023671325878931550/IMG_6557.png?width=433&height=433')
.setDescription("✅ /ban-list - **Banlı Kullanıcıları Gösterir!**\n✅ /ban - **Bir Üyeyi Yasaklarsın!**\n✅ /emojiler - **Emojileri Görürsün!**\n✅ /forceban - **ID İle Bir Kullanıcıyı Yasaklarsın!**\n✅ /giriş-çıkış - **Giriş çıkış kanalını ayarlarsın!**\n✅ /kanal-açıklama - **Kanalın Açıklamasını Değiştirirsin!**\n✅ /kick - **Bir Üyeyi Atarsın!**\n✅ /küfür-engel - **Küfür Engel Sistemini Açıp Kapatırsın!**\n✅ /oto-rol - **Otorolü Ayarlarsın!**\n✅ /oto-tag - **Oto Tagı Ayarlarsın!**\n✅ /oylama - **Oylama Açarsın!**\n✅ /reklam-engel - **Reklam Engel Sistemini Açarsın!**\n✅ /rol-al - **Rol Alırsın**\n✅ /rol-oluştur - **Rol Oluşturursun!**\n✅ /rol-ver - **Rol Verirsin!**\n✅ /sa-as - **Selam Sistemine Bakarsın!**\n✅ /temizle - **Mesaj Silersin!**\n✅ /unban - **Bir üyenin yasağını kaldırırsın!**")
.setColor("#000000")
interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "uptime") {
    const embed = new Discord.EmbedBuilder()
    .setTitle("Uptime Yardım Menüsü!")
    .setThumbnail('https://media.discordapp.net/attachments/1022843509016895568/1023671325878931550/IMG_6557.png?width=433&height=433')
    .setDescription("✅ /uptime-ayarla - **Uptime Sistemi Ayarlarsın!**")
    .setColor("#000000")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "kayıt") {
    const embed = new Discord.EmbedBuilder()
    .setTitle("Kayıt Yardım Menüsü!")
    .setThumbnail('https://media.discordapp.net/attachments/1022843509016895568/1023671325878931550/IMG_6557.png?width=433&height=433')
    .setDescription("<:aktif:1018637501092605992> /kayıtlı-rol - **Kayıtlı Rolünü Ayarlarsın!**\n<:aktif:1018637501092605992> /kayıt-et - **Bir Üyeyi Kayıt Edersin!**")
    .setColor("#000000")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "Privacy Policy") {
    const embed = new Discord.EmbedBuilder()
    .setTitle("Gizlilik Politikası!")
    .setThumbnail('https://media.discordapp.net/attachments/1022843509016895568/1023671325878931550/IMG_6557.png?width=433&height=433')
    .setDescription("✅ 1- **Amaç: Bu Discord botu, kullanıcıların sohbet deneyimini kolaylaştırmak ve eğlendirmek için tasarlandı**\n ✅ 2- **Kabul Edilebilir Kullanım: Botu yalnızca Discord sunucusunda belirtilen amaçlar için kullanın. Botun kullanımı yasa dışı veya yanlış kullanımı ile sonuçlanan herhangi bir aksiyon veya etkinliğe neden olmamalıdır**\n  ✅ 3- **Veri Koruma ve Gizlilik: Bot tarafından toplanan ve depolanan tüm kullanıcı verileri gizlilik politikamız doğrultusunda korunacaktır. Kullanıcı verilerinin üçüncü taraflarla paylaşılması veya satılması kabul edilemez**\n ✅ 4- **Politika İhlali: Politika ihlal edildiğinde, Discord sunucusundaki yetkili yöneticilere rapor edilecektir ve gerekli adımlar atılacaktır. Adımlar arasında botun kullanımının askıya alınması, sunucudan atılması veya hesabın banlanması gibi seçenekler bulunabilir**\n ✅ 5- **Destek ve Şikayet Süreci: Bot hakkında sorularınız veya şikâyetleriniz için lütfen Discord üzerinden bana özelden yazın**\n ✅ 6- **Doğru ve Güncel Bilgi: Bot hakkındaki veriler daima güncel ve doğru olacaktır**\n ✅ 7- ** Gizlilik Koruma: Bot tarafından toplanan ve depolanan tüm kullanıcı verileri gizlilik politikamız doğrultusunda korunacaktır**\n  ✅ 8- **Yasa Dışı Faaliyetlere İzin Verilmez: Botun kullanımı yasa dışı veya yanlış kullanımı ile sonuçlanan herhangi bir aksiyon veya etkinliğe neden olmamalıdır**\n  ✅ 9- ** Botun Güvenliği: Botun güvenliği ve kullanıcı verilerinin güvenliği her zaman öncelikli tutulacaktır**\n ✅ 10- ** Dürüst ve Etik Değerlere Uygun Yönetim: Botun yapısı, çalışması ve kullanımı dürüst ve etik değerlere uygun olarak yönetilmektedir**\n")
    .setColor("#000000")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "kullanıcı") {
    const embed = new Discord.EmbedBuilder()
    .setTitle("Kullanıcı Yardım Menüsü!")
    .setThumbnail('https://media.discordapp.net/attachments/1022843509016895568/1023671325878931550/IMG_6557.png?width=433&height=433')
    .setDescription("<:aktif:1018637501092605992> /avatar - **Bir Kullanıcının Avatarına Bakarsın!**\n<:aktif:1018637501092605992> /afk - **Sebepli Afk Olursun!**\n<:aktif:1018637501092605992> /emoji-yazı - **Bota Emoji İle Yazı Yazdırırsın!**\n<:aktif:1018637501092605992> /kurucu-kim - **Kurucuyu Gösterir!**\n<:aktif:1018637501092605992> /ping - **Botun pingini gösterir!**\n<:aktif:1018637501092605992> /yardım - **Yardım Menüsünü Gösterir!**")
    .setColor("#000000")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
})