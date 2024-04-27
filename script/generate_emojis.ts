import { Client, IntentsBitField } from "discord.js";
import { createCanvas } from "canvas";

const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const guildId = "1233863343018868757";
const color = "#333333";
const suffix = "default";

console.log("hi");

const client = new Client({ intents: [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages] });

client.on("ready", async() => {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    throw new Error("No guild");
  }

  for (const char of chars) {
    const canvas = createCanvas(128, 128);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "80px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char.toUpperCase(), 64, 64);

    const emoji = await guild.emojis.create({
      attachment: canvas.toDataURL(),
      name: `${char}_${suffix}`,
      reason: "ok",
    });
    console.log(`"${char}_${suffix}": "${emoji.toString()}",`);
  }
});

void client.login(process.env.TOKEN || "");