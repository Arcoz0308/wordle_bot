import { Word } from "#/lib/wordle/word";
import type { Char, CharColor, Result, RoundInfo, WordCharInfo } from "#/lib/wordle/result";
import { InvalidWordError } from "#/lib/wordle/error/invalid_word_error";
import { InvalidWordLengthError } from "#/lib/wordle/error/invalid_word_length_error";
import { anyToError, validChars } from "#/lib/wordle/util";

export class Game {

  word: Word;

  valid = true;

  error: Error|null = null;

  start: number;

  rounds: RoundInfo[] = [];

  chars: Record<Char, CharColor> = Object.fromEntries(validChars.map((char) => [char, "default"])) as Record<Char, CharColor>;

  maxRounds: number;

  constructor(word: string, maxRounds: number = 6) {
    this.word = new Word(word);

    if (!this.word.valid()) {
      this.valid = false;
      this.error = new Error(`invalid word, errors : ${this.word.errors.map((err) => err.message).join("\n")}`);
    }

    this.start = Date.now();
    this.maxRounds = maxRounds;
  }

  round(word: string): Result {
    try {
      const guess = new Word(word);
      if (!guess.valid()) {
        return {
          status: "invalid",
          error: new InvalidWordError(guess.word, guess.errors),
        };
      }

      if (!this.word.lengthEqual(guess)) {
        return {
          status: "invalid",
          error: new InvalidWordError(guess.word, [
            new InvalidWordLengthError(guess.length, this.word.length)]),
        };
      }

      const charInfos: WordCharInfo[] = [];
      for (const [index, guessChar] of guess.characters.entries()) {
        if (this.word.hasCharacter(guessChar)) {
          if (this.word.haveCharacterAtPosition(guessChar, index + 1)) {
            charInfos.push({
              value: guessChar.saveValue(),
              position: index + 1,
              color: "green",
            });
            this.chars[guessChar.saveValue()] = "green";
            continue;
          }

          charInfos.push({
            value: guessChar.saveValue(),
            position: index + 1,
            color: "yellow",
          });

          if (this.chars[guessChar.saveValue()] !== "green") {
            this.chars[guessChar.saveValue()] = "yellow";
          }

          continue;
        }

        charInfos.push({
          value: guessChar.saveValue(),
          position: index + 1,
          color: "grey",
        });

        this.chars[guessChar.saveValue()] = "grey";


      }

      for (const char of this.word.characters) {
        const toChecks = [...charInfos.filter((c) => c.value === char.saveValue() && c.color === "yellow")].reverse();
        for (const toCheck of toChecks) {
          if (this.word.characterCount(char) < charInfos.filter((c) => c.value === char.saveValue()).length) {
            charInfos[toCheck.position - 1] = {
              value: toCheck.value,
              position: toCheck.position,
              color: "grey",
            };
          }
        }
      }


      this.rounds.push({
        chars: charInfos,
      });

      if (this.word.equal(guess)) {
        return {
          status: "win",
          rounds: this.rounds,
          time: Date.now() - this.start,
        };
      }

      if (this.rounds.length >= this.maxRounds) {
        return {
          status: "lose",
          rounds: this.rounds,
          wordToFind: this.word.word,
        };
      }

      return {
        status: "round",
        rounds: this.rounds,
        chars: this.chars,
      };


    } catch (e) {
      return {
        status: "internalError",
        message: anyToError(e).message,
      };
    }
  }

}