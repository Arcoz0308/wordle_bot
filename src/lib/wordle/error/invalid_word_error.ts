import type { InvalidWordLengthError } from "#/lib/wordle/error/invalid_word_length_error";
import type { InvalidCharacterError } from "#/lib/wordle/error/invalid_character_error";

export class InvalidWordError extends Error {

  causes: (InvalidWordError|InvalidWordLengthError)[]|InvalidCharacterError[];

  word: string;

  constructor(word: string, causes: (InvalidWordError|InvalidWordLengthError)[]|InvalidCharacterError[]) {
    super("invalid word");

    this.name = "InvalidWordError";
    this.causes = causes;
    this.word = word;
  }

}