import type { Char } from "#/lib/wordle/result";

export const validChars: Char[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


export const anyToError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  }

  if (typeof e === "string") {
    return new Error(e);
  }

  return new Error(String(e));
};