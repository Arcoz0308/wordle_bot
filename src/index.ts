import type { Message } from "discord.js";
import { Client, IntentsBitField } from "discord.js";
import type { Game } from "#/lib/wordle/game";

const client = new Client({ intents: [
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages,
],
});

const games = new Map<string, {channel: string; game: Game}>();

client.on("messageCreate", async(message) => {
  try {
    if (message.content.trim().startsWith("!hello")) {
      await message.reply("Hello!");
      return;
    }

    if (message.content.trim().startsWith("!wordle")) {
      await startGame(message);
    }
  } catch (e) {
    console.error(e);
  }
});

const startGame = async(message: Message): Promise<void> => {
  try {

  } catch (e) {
    console.error(e);
  }
};

client.on("ready", () => {
  console.log("ready !");
});

void client.login(process.env.TOKEN || "");