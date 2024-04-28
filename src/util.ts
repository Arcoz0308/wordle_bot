import type { Char, CharColor, Lose, Round, RoundInfo, Win } from "#/lib/wordle/result";
import { emojis, emptyDefault } from "#/emojis";
import { EmbedBuilder } from "discord.js";

export const generateRow = (round: RoundInfo): string => {
  return round.chars.map((char) => emojis[`${char.value}_${char.color}`]).join(" ");
};

export const generateRows = (rounds: RoundInfo[], length: number, wordLength: number): string => {
  let text = "";
  for (let i = 0; i < length; i++) {
    if (rounds[i]) {
      text += generateRow(rounds[i]);
    } else {
      text += `${emptyDefault} `.repeat(wordLength);
    }
    text += "\n";
  }

  return text;
};

export const generateAlphabet = (chars: Record<Char, CharColor>): string => {
  return Object.keys(chars).map((char) => emojis[`${char as Char}_${chars[char as Char]}`]).join(" ");
};

export const generateBaseEmbed = (infos: Win|Round|Lose, maxRounds: number): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle(`Round ${infos.rounds.length}/${maxRounds}`)
    .setFields([
      {
        name: "jeu :",
        value: generateRows(infos.rounds, maxRounds, infos.wordToFind.length),
      },
      {
        name: "Alphabet :",
        value: generateAlphabet(infos.chars),
      },
    ]);
};

export const generateRoundEmbed = (info: Round, maxRounds: number): EmbedBuilder => {
  return generateBaseEmbed(info, maxRounds)
    .setDescription("Pour proposer un mot, envoyer un message en dessous !")
    .setColor("Yellow");
};

export const generateWinEmbed = (info: Win, maxRounds: number): EmbedBuilder => {
  return generateBaseEmbed(info, maxRounds)
    .setColor("Green")
    .setDescription(`Bien joué, vous avez trouvé le mot **${info.wordToFind}** en ${Math.floor(info.time / 1000)} secondes !`);
};

export const generateLoseEmbed = (info: Lose, maxRound: number): EmbedBuilder => {
  return generateBaseEmbed(info, maxRound)
    .setColor("Red")
    .setDescription(`Dommage, vous avez perdu, le mot à trouvé etais **${info.wordToFind}**`);
};

export const generateTimeoutEmbed = (info: Round, maxRound: number): EmbedBuilder => {
  return generateBaseEmbed(info, maxRound)
    .setColor("Red")
    .setDescription("Temps écoulé, le mot à trouvé etais **${info.wordToFind}**");
};