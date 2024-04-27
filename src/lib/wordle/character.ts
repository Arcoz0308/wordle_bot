import { InvalidCharacterError } from "#/lib/wordle/error/invalid_character_error";
import type { Char } from "#/lib/wordle/result";
import { validChars } from "#/lib/wordle/util";

export class Character {

  static VALID_VALUES: string[] = validChars;

  value: string;

  constructor(value: string) {
    this.value = value;
  }

  valid(): boolean {
    return Character.VALID_VALUES.includes(this.value);
  }

  generateError(position: number): InvalidCharacterError {
    return new InvalidCharacterError(position, this.value);
  }

  saveValue(): Char {
    if (this.valid()) {
      return this.value as Char;
    }

    return "?";
  }

}