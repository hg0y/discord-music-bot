const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const queue = new Map();

function playSong(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, { filter: "audioonly", highWaterMark: 1 << 25 });
  const resource = createAudioResource(stream);
  serverQueue.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
  serverQueue.player.play(resource);
  serverQueue.connection.subscribe(serverQueue.player);

  serverQueue.player.on("idle", () => {
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  });

  serverQueue.player.on("error", error => {
    console.error(error);
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  });

  if (serverQueue.textChannel) {
    serverQueue.textChannel.send(`🎵 يتم الآن تشغيل: **${song.title}**`);
}

}

module.exports = { playSong, queue };
