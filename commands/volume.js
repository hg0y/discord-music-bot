const { queue } = require("../utils/playSong");

module.exports = {
  name: "volume",
  description: "تغيير مستوى الصوت.",
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);

    if (!serverQueue) return message.reply("❌ لا يوجد أي موسيقى قيد التشغيل!");
    if (!serverQueue.connection) return message.reply("❌ البوت غير متصل بالقناة الصوتية!");

    const volume = parseFloat(args[0]);

    if (isNaN(volume) || volume < 0 || volume > 2) {
      return message.reply("❌ يرجى إدخال رقم بين **0.1 و 2** لتحديد مستوى الصوت.");
    }

    // ✅ التأكد من أن مشغل الصوت موجود
    if (!serverQueue.player) return message.reply("❌ لا يوجد مشغل صوتي نشط!");

    // ✅ إنشاء مورد صوتي جديد مع مستوى الصوت الجديد
    serverQueue.player.state.resource.volume.setVolume(volume);

    message.reply(`🔊 تم ضبط مستوى الصوت إلى **${volume}**`);
  }
};
