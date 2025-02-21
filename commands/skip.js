const { queue } = require("../utils/playSong");

module.exports = {
  name: "skip",
  description: "تخطي الأغنية الحالية.",
  execute(message) {
    const serverQueue = queue.get(message.guild.id);

    if (!serverQueue) return message.reply("❌ لا توجد قائمة تشغيل حالية لتخطيها!");
    if (!serverQueue.songs.length) return message.reply("❌ لا توجد أغاني في قائمة التشغيل!");

    // ✅ التحقق مما إذا كان هناك أغنية قيد التشغيل
    if (!serverQueue.player) return message.reply("❌ لا يوجد مشغل صوتي نشط!");

    // ✅ تخطي الأغنية الحالية
    serverQueue.songs.shift(); // إزالة الأغنية الحالية من قائمة الانتظار

    // ✅ تشغيل الأغنية التالية إذا كانت موجودة
    if (serverQueue.songs.length > 0) {
      message.reply(`⏭️ تم تخطي الأغنية! تشغيل: **${serverQueue.songs[0].title}**`);
      require("../utils/playSong").playSong(message.guild, serverQueue.songs[0]);
    } else {
      message.reply("⏹️ لا توجد أغاني أخرى في قائمة التشغيل. سيتم مغادرة القناة الصوتية.");
      serverQueue.connection.destroy(); // مغادرة القناة الصوتية
      queue.delete(message.guild.id);
    }
  }
};
