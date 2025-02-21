const { queue } = require("../utils/playSong"); // ✅ إصلاح الاستيراد الصحيح

module.exports = {
  name: "stop",
  description: "إيقاف الموسيقى والخروج من القناة الصوتية.",
  execute(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.reply("❌ لا توجد أغاني قيد التشغيل!");

    // ✅ إفراغ قائمة التشغيل وإيقاف الموسيقى
    serverQueue.songs = [];
    serverQueue.player?.stop();
    serverQueue.connection?.destroy(); // تدمير الاتصال بالخادم الصوتي

    queue.delete(message.guild.id);
    return message.reply("⏹️ تم إيقاف الموسيقى والخروج من القناة الصوتية.");
  }
};
