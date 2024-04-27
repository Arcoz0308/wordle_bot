import { expect, describe, it } from "vitest";
import { Character } from "#/lib/wordle/character";
import { InvalidCharacterError } from "#/lib/wordle/error/invalid_character_error";

describe("Character", () =>  {
  describe("#valid", () => {
    it("should return true when the value is in VALID_VALUES", () => {
      const character = new Character("A");
      expect(character.valid()).to.equal(true);
    });

    it("should return false when the value is not in VALID_VALUES", () => {
      const character = new Character("!");
      expect(character.valid()).to.be.false;
    });
  });

  describe("#generateError", () => {
    it("should return an InvalidCharacterError", () => {
      const character = new Character("!");
      const error = character.generateError(1);
      expect(error).to.be.instanceof(InvalidCharacterError);
    });
  });

  describe("#saveValue", () => {
    it("should return the character value if the value is valid", () => {
      const character = new Character("a");
      expect(character.saveValue()).to.equal("a");
    });

    it("should return \"?\" if the value is invalid", () => {
      const character = new Character("!");
      expect(character.saveValue()).to.equal("?");
    });
  });
});