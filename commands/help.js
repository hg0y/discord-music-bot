const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  description: "عرض قائمة بجميع الأوامر وطريقة التشغيل.",
  execute(message) {
    const helpEmbed = new EmbedBuilder()
      .setColor("#0099ff") // لون الإطار
      .setTitle("📜 قائمة الأوامر") // عنوان القائمة
      .setDescription("🎵 **أوامر تشغيل الموسيقى:**") // وصف القائمة
      .addFields(
        { name: "▶️ تشغيل الموسيقى", value: "`!play [رابط يوتيوب]` - تشغيل أغنية باستخدام رابط." },
        { name: "🔍 البحث عن أغنية", value: "`!play [اسم الأغنية]` - البحث عن أغنية وتشغيلها." },
        { name: "⏭ تخطي الأغنية", value: "`!skip` - تخطي الأغنية الحالية." },
        { name: "⏹ إيقاف الموسيقى", value: "`!stop` - إيقاف الموسيقى والخروج من القناة الصوتية." },
        { name: "📜 قائمة الانتظار", value: "`!queue` - عرض قائمة الانتظار الحالية." },
        { name: "🔊 التحكم في الصوت", value: "`!volume [0-2]` - تغيير مستوى الصوت (مثال: `!volume 1.5`)." }
      )
      .addFields(
        { name: "📌 **أوامر إضافية:**", value: "`!help` - عرض قائمة الأوامر." }
      )
      .addFields(
        { name: "🚀 **كيفية الاستخدام؟**", value: "1️⃣ **انضم إلى قناة صوتية في السيرفر.**\n2️⃣ **استخدم `!play` لتشغيل أغنية.**\n3️⃣ **استخدم `!skip` أو `!stop` للتحكم في التشغيل.**" }
      )
      .setFooter({ text: "Fizi Bot v2 - بوت الموسيقى 🎶", iconURL: message.client.user.displayAvatarURL() });

    message.channel.send({ embeds: [helpEmbed] });
  }
};
