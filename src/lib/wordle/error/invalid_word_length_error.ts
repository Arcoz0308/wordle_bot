export class InvalidWordLengthError extends Error {

  length: number;

  exceptedLength: number;

  constructor(length: number, exceptedLength: number) {
    super();

    this.length = length;
    this.exceptedLength = exceptedLength;
  }

}