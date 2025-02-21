const { joinVoiceChannel } = require("@discordjs/voice");
const { playSong, queue } = require("../utils/playSong");
const ytdl = require("@distube/ytdl-core");
const yts = require("yt-search"); // مكتبة البحث في يوتيوب
const { FFmpeg } = require('prism-media');

module.exports = {
  name: "play",
  description: "تشغيل أغنية من YouTube أو البحث عنها.",
  async execute(message, args) {
    if (!args.length) return message.reply("❌ يرجى إدخال اسم الأغنية أو رابط.");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("❌ يجب أن تكون في قناة صوتية!");

    let song;
    
    // ✅ التحقق مما إذا كان الرابط صحيحًا
    if (ytdl.validateURL(args[0])) {
      try {
        const songInfo = await ytdl.getInfo(args[0]);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        };
      } catch (error) {
        console.error(error);
        return message.reply("❌ حدث خطأ أثناء محاولة جلب معلومات الأغنية.");
      }
    } else {
      // ✅ البحث عن الأغنية إذا لم يكن هناك رابط
      try {
        const searchResults = await yts(args.join(" "));
        if (!searchResults.videos.length) return message.reply("❌ لم يتم العثور على نتائج!");
        
        song = {
          title: searchResults.videos[0].title,
          url: searchResults.videos[0].url,
        };
      } catch (error) {
        console.error(error);
        return message.reply("❌ حدث خطأ أثناء البحث عن الأغنية.");
      }
    }

    // ✅ التحقق مما إذا كانت هناك قائمة تشغيل للسيرفر
    let serverQueue = queue.get(message.guild.id);

    // ✅ إعادة ضبط قائمة الانتظار إذا كان البوت قد طُرد من القناة الصوتية
    if (!serverQueue || !serverQueue.connection || serverQueue.connection.state.status === "disconnected") {
      queue.delete(message.guild.id); // حذف القائمة القديمة بالكامل

      // ✅ إنشاء قائمة تشغيل جديدة
      serverQueue = {
        textChannel: message.channel,
        voiceChannel,
        connection: null,
        songs: [],
      };

      queue.set(message.guild.id, serverQueue);
    }

    serverQueue.songs.push(song);

    // ✅ إعادة الاتصال بالقناة الصوتية وتشغيل الأغنية الجديدة فقط
    if (!serverQueue.connection) {
      try {
        serverQueue.connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
        });

        playSong(message.guild, serverQueue.songs[0]); // تشغيل الأغنية الجديدة فقط
      } catch (error) {
        console.error(error);
        queue.delete(message.guild.id);
        return message.reply("❌ حدث خطأ أثناء الانضمام للقناة الصوتية.");
      }
    } else {
      return message.reply(`🎵 تمت إضافة **${song.title}** إلى قائمة الانتظار.`);
    }
  }
};
