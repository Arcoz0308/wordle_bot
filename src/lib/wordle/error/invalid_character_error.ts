export class InvalidCharacterError extends Error {

  position: number;

  character: string;

  constructor(position: number, character: string) {
    super(`get invalid character "${character}" at position ${position}`);

    this.name = "InvalidCharacterError";
    this.position = position;
    this.character = character;
  }

}