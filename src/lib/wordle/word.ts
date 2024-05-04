import { Character } from "#/lib/wordle/character";
import type { InvalidCharacterError } from "#/lib/wordle/error/invalid_character_error";
import normalizeSpecialCharacters from "specialtonormal";

export class Word {

  value: string;

  characters: Character[];

  errors: InvalidCharacterError[] = [];

  constructor(word: string) {
    this.value = normalizeSpecialCharacters(word.toLowerCase());

    this.characters = this.value.split("").map((char) => new Character(char));
  }

  get length(): number {
    return this.characters.length;
  }

  valid(): boolean {
    let valid = true;
    for (const [key, char] of this.characters.entries()) {
      if (!char.valid()) {
        this.errors.push(char.generateError(key + 1));
        valid = false;
      }
    }

    return valid;
  }

  equal(world: Word): boolean {
    return this.value.toLowerCase() === world.value.toLowerCase();
  }

  lengthEqual(word: Word): boolean {
    return this.length === word.length;
  }

  hasCharacter(char: Character): boolean {
    return this.characters.some((c) => c.value === char.value);
  }

  haveCharacterAtPosition(char: Character, position: number): boolean {
    return this.characters[position - 1]?.value === char.value;
  }

  characterCount(char: Character): number {
    return this.characters.filter((c) => c.value === char.value).length;
  }


}