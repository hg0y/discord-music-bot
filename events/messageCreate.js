module.exports = {
    name: "messageCreate",
    execute(client, message) {
      if (!message.content.startsWith("!") || message.author.bot) return;
    
      const args = message.content.slice(1).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
    
      if (!client.commands.has(commandName)) return;
  
      try {
        client.commands.get(commandName).execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
      }
    }
  };
  