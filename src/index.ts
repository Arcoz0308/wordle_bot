import type { Message } from "discord.js";
import { Client, IntentsBitField } from "discord.js";
import { Game } from "#/lib/wordle/game";
import { randomWord } from "#/words";
import { generateLoseEmbed, generateRoundEmbed, generateTimeoutEmbed, generateWinEmbed } from "#/util";

const client = new Client({ intents: [
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildEmojisAndStickers,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
  IntentsBitField.Flags.DirectMessages,
  IntentsBitField.Flags.GuildMessageReactions,
],
});

const games = new Map<string, {channel: string; msg: Message; game: Game}>();


const startGame = async(message: Message): Promise<void> => {
  try {
    const game = new Game(randomWord());
    const msg = await message.reply({ embeds: [generateRoundEmbed(game.getRoundInfo(), 6)] });
    games.set(message.author.id, { channel: message.channel.id, msg, game });

    game.timeout(async() => {
      games.delete(message.author.id);
      await msg.edit({ embeds: [generateTimeoutEmbed(game.getRoundInfo(), 6)] });
    }, 60 * 1000);
  } catch (e) {
    console.error(e);
  }
};

const handleGame = async(message: Message, gameInfos: {channel: string; msg: Message; game: Game}): Promise<void> => {
  try {
    const word = message.content.trim();
    const result = gameInfos.game.round(word);

    switch (result.status) {
      case "internalError": {
        await message.reply("une erreur interne est arrivé");
        break;
      }
      case "invalid": {
        await message.reply("votre mot est invalide, contrôler la longeur et si les charactères sont classiques");
        break;
      }
      case "win": {
        games.delete(message.author.id);
        await gameInfos.msg.edit({ embeds: [generateWinEmbed(result, 6)] });
        await message.react("🎉");
        break;
      }
      case "round": {
        await gameInfos.msg.edit({ embeds: [generateRoundEmbed(result, 6)] });
        await message.react("❌");
        break;
      }
      case "lose": {
        games.delete(message.author.id);
        await gameInfos.msg.edit({ embeds: [generateLoseEmbed(result, 6)] });
        await message.react("❌");
        break;
      }
      default: {
        await message.reply("une erreur interne est arrivé");
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }
};

client.on("messageCreate", async(message) => {
  try {
    if (message.content.trim().startsWith("!hello")) {
      await message.reply("Hello!");
      return;
    }

    if (message.content.trim().startsWith("!wordle")) {
      await startGame(message);
      return;
    }

    const gameInfos = games.get(message.author.id);
    if (gameInfos && gameInfos.channel === message.channel.id) {
      await handleGame(message, gameInfos);
    }
  } catch (e) {
    console.error(e);
  }
});


client.on("ready", () => {
  console.log("ready !");
});

void client.login(process.env.TOKEN || "");