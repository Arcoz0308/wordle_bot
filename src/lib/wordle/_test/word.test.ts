import { expect, describe, it } from "vitest";
import { Word } from "#/lib/wordle/word";
import { Character } from "#/lib/wordle/character";

describe("Word", () =>  {
  describe("#length", () => {
    it("should return the number of characters in the word", () => {
      const word = new Word("test");
      expect(word.length).to.equal(4);
    });
  });

  describe("#valid", () => {
    it("should return true when the word is valid", () => {
      const word = new Word("test");
      expect(word.valid()).to.be.true;
    });

    it("should return false when the word is invalid", () => {
      // assuming that '!' is an invalid character
      const word = new Word("test!");
      expect(word.valid()).to.be.false;
    });
  });

  describe("#equal", () => {
    it("should return true when the input word is equal to the word", () => {
      const word = new Word("test");
      expect(word.equal(new Word("test"))).to.be.true;
    });

    it("should return false when the input word is not equal to the word", () => {
      const word = new Word("test");
      expect(word.equal(new Word("different"))).to.be.false;
    });
  });

  describe("#lengthEqual", () => {
    it("should return true when the length of the input word is equal to the length of the word", () => {
      const word = new Word("test");
      expect(word.lengthEqual(new Word("abcd"))).to.be.true;
    });

    it("should return false when the length of the input word is not equal to the length of the word", () => {
      const word = new Word("test");
      expect(word.lengthEqual(new Word("abcdef"))).to.be.false;
    });
  });

  describe("#characters", () => {
    it("should return an array of characters in the word", () => {
      const word = new Word("test");
      expect(word.characters).to.deep.equal([
        new Character("t"),
        new Character("e"),
        new Character("s"),
        new Character("t"),
      ]);
    });

    it("should return characters count for one character", () => {
      const word = new Word("test");
      const character = new Character("t");
      expect(word.characterCount(character)).to.equal(2);
    });

    it("should return if character is not in the word", () => {
      const word = new Word("test");
      const character = new Character("z");
      expect(word.hasCharacter(character)).to.be.false;
    });

    it("should return if character is in the word", () => {
      const word = new Word("test");
      const character = new Character("t");
      expect(word.hasCharacter(character)).to.be.true;
    });

    it("should return true if the character is at the specified position", () => {
      const word = new Word("test");
      const character = new Character("t");
      expect(word.haveCharacterAtPosition(character, 1)).to.be.true;
    });
  });

});