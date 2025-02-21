const { queue } = require("../utils/playSong");
const { FFmpeg } = require('prism-media');

module.exports = {
  name: "queue",
  description: "عرض قائمة الانتظار الحالية.",
  execute(message) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue || !serverQueue.songs.length) return message.reply("❌ لا توجد أغاني في قائمة الانتظار!");

    let queueMessage = "🎶 **قائمة الانتظار:**\n";
    serverQueue.songs.forEach((song, index) => {
      queueMessage += `${index + 1}. **${song.title}**\n`;
    });

    message.channel.send(queueMessage);
  }
};
