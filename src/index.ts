import type { Message } from "discord.js";
import { Client, IntentsBitField } from "discord.js";
import { Game } from "#/lib/wordle/game";
import { randomWord } from "#/words";
import {
  generateDuoAbandons, generateDuoLose,
  generateLoseEmbed,
  generateRoundDuo,
  generateRoundEmbed,
  generateTimeoutEmbed, generateWinDuo,
  generateWinEmbed
} from "#/util";
import { availableWords } from "./available_words";
import normalizeSpecialCharacters from "specialtonormal";
import type { DuoGame } from "#/type";

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
const duoGames: DuoGame[] = [];


const startGame = async(message: Message): Promise<void> => {
  try {

    if (duoGames.find((g) => g.user1.id === message.author.id || g.user2.id === message.author.id)) {
      await message.reply("vous etes deja en jeu duo, finisez cette partie avant");
      return;
    }

    const game = new Game(randomWord());
    const msg = await message.reply({ embeds: [generateRoundEmbed(game.getRoundInfo(), 6)] });
    games.set(message.author.id, { channel: message.channel.id, msg, game });
    const channelName = message.channel.isDMBased() ? "dm" : message.channel.name;
    console.log(`"${message.author.username}" start wordle game for word "${game.word.word}" in channel "${channelName}"`);

    game.timeout(async() => {
      games.delete(message.author.id);
      await msg.edit({ embeds: [generateTimeoutEmbed(game.getRoundInfo(), 6)] });
      await msg.reply("temps écoulé !");
    }, 60 * 1000);
  } catch (e) {
    console.error(e);
  }
};

const handleGame = async(message: Message, gameInfos: {channel: string; msg: Message; game: Game}): Promise<void> => {
  try {
    const word = message.content.trim();

    if (word.toLowerCase() === "stop" || word.toLowerCase() === "!stop") {
      gameInfos.game.removeTimeout();
      games.delete(message.author.id);
      await message.reply("jeu arreté !");
      await message.react("✅");
      return;
    }

    const result = gameInfos.game.round(word);

    switch (result.status) {
      case "internalError": {
        await message.reply("une erreur interne est arrivé");
        break;
      }
      case "invalid": {
        await message.reply("votre mot est invalide, contrôler la longeur et si si le mot ne contient aucuns caractères spécieux");
        break;
      }
      case "win": {
        games.delete(message.author.id);
        await gameInfos.msg.edit({ embeds: [generateWinEmbed(result, 6)] });
        await message.react("🎉");
        break;
      }
      case "round": {

        if (!availableWords.includes(normalizeSpecialCharacters(word.toLowerCase()))) {
          await message.reply("votre mot n'est pas dans la liste des mots autorisés");
          gameInfos.game.resetTimeout();
          gameInfos.game.rounds = gameInfos.game.rounds.slice(0, -1);
          return;
        }

        await gameInfos.msg.edit({ embeds: [generateRoundEmbed(result, 6)] });
        await message.react("✖️");
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

const randomBoolean = (): boolean => {

  const randomNumber = Math.round(Math.random());
  return randomNumber === 1;
};

const startDuo = async(message: Message): Promise<void> => {
  if (duoGames.find((g) => g.user1.id === message.author.id || g.user2.id === message.author.id)) {
    await message.reply("vous etes deja dans un duo !");
    return;
  }


  const user2 = message.mentions.users.first();
  if (!user2) {
    await message.reply("pas d'utilisateur trouver, utiliser !duo @utilisateur");
    return;
  }

  if (user2.id === message.author.id) {
    await message.reply("vous pouvez pas jouer contre vous même !");
    return;
  }

  if (user2.bot) {
    await message.reply("cela risque d'etre compliqué de jouer contre un bot");
    return;
  }

  if (duoGames.find((g) => g.user1.id === user2.id || g.user2.id === user2.id) || games.has(user2.id))  {
    await message.reply(`${user2.toString()} est deja en jeu !`);
    return;
  }

  const game = new Game(randomWord());
  const newGame: Omit<DuoGame, "msg"> = {
    user1: {
      id: message.author.id,
      name: message.author.username,
      nextPlay: randomBoolean(),
    },
    user2: {
      id: user2.id,
      name: user2.username,
    },
    game: game,
    channel: message.channel.id,
  };

  const msg = await message.reply({ embeds: [generateRoundDuo(newGame, 6)] });

  const gameObject: DuoGame = { ...newGame, msg: msg };
  game.timeout(async() => {
    const index = duoGames.findIndex((g) => g === gameObject);
    if (index >= 0) {
      duoGames.splice(index, 1);
    }
    await msg.edit({ embeds: [generateDuoAbandons(
      "timeout",
      gameObject.user1.nextPlay ? gameObject.user1.id : gameObject.user2.id,
      gameObject,
      6
    )] });
    await msg.reply(`partie annulé, ${gameObject.user1.nextPlay ? gameObject.user1.name : gameObject.user2.name} a pris trop de temps !`);
  }, 60 * 1000);

  duoGames.push(gameObject);
};


const handleDuoGame = async(message: Message, gameInfos: DuoGame): Promise<void> => {
  try {
    const word = message.content.trim();

    if (word.toLowerCase() === "stop" || word.toLowerCase() === "!stop") {
      gameInfos.game.removeTimeout();
      const index = duoGames.findIndex((g) => g.user1.id === gameInfos.user1.id);
      if (index >= 0) {
        duoGames.splice(index, 1);
      }

      await gameInfos.msg.edit({ embeds: [
        generateDuoAbandons("Stop volontaire", message.author.id, gameInfos, 6),
      ] });

      await message.reply("jeu arreté !");
      await message.react("✅");
      return;
    }

    if (gameInfos.user1.nextPlay) {
      if (gameInfos.user1.id !== message.author.id) {
        await message.react("⏱️");
        return;
      }
    } else if (gameInfos.user2.id !== message.author.id) {
      await message.react("⏱️");
      return;
    }

    const result = gameInfos.game.round(word);

    switch (result.status) {
      case "internalError": {
        await message.reply("une erreur interne est arrivé");
        break;
      }
      case "invalid": {
        await message.reply("votre mot est invalide, contrôler la longeur et si le mot ne contient aucuns caractères spécieux");
        break;
      }
      case "win": {
        const index = duoGames.findIndex((g) => g === gameInfos);
        if (index >= 0) {
          duoGames.splice(index, 1);
        }

        await gameInfos.msg.edit({ embeds: [generateWinDuo(result, gameInfos, 6)] });
        await message.react("🎉");
        break;
      }
      case "round": {
        if (!availableWords.includes(normalizeSpecialCharacters(word.toLowerCase()))) {
          await message.reply("votre mot n'est pas dans la liste des mots autorisés");
          gameInfos.game.resetTimeout();
          gameInfos.game.rounds = gameInfos.game.rounds.slice(0, -1);
          return;
        }

        gameInfos.user1.nextPlay = !gameInfos.user1.nextPlay;
        await gameInfos.msg.edit({ embeds: [generateRoundDuo(gameInfos, 6)] });
        await message.react("✖️");
        break;
      }
      case "lose": {
        const index = duoGames.findIndex((g) => g === gameInfos);
        if (index >= 0) {
          duoGames.splice(index, 1);
        }
        await gameInfos.msg.edit({ embeds: [generateDuoLose(result, gameInfos, 6)] });
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
      return;
    }

    if (message.content.trim().startsWith("!duo")) {
      await startDuo(message);
      return;
    }

    const gameDuo = duoGames.find((g) => g.user1.id === message.author.id || g.user2.id === message.author.id);
    if (gameDuo && gameDuo.channel === message.channel.id) {
      await handleDuoGame(message, gameDuo);
      return;
    }
  } catch (e) {
    console.error(e);
  }
});


client.on("ready", () => {
  console.log("ready !");
});

void client.login(process.env.TOKEN || "");